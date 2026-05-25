const mlService = require('./ml.service');
const llmService = require('./llm.service');
const logger = require('../config/logger');

class QueryService {
  async processQuery(queryText, options = {}, userId = null) {
    try {
      const { documentIds, topK, minScore, includeSources, includeChunks, hybridMode } = options || {};
      
      const safeTopK = Math.min(Math.max(Number(topK) || 5, 1), 10);
      const safeMinScore = isNaN(Number(minScore)) ? 0.1 : Math.min(Math.max(Number(minScore), 0), 1);
      const isIncludeSources = includeSources !== false;
      const isIncludeChunks = includeChunks !== false;
      const isHybridMode = hybridMode !== false; // Default to true if not explicitly false

      let validDocIds = new Set();
      if (documentIds && Array.isArray(documentIds) && documentIds.length > 0) {
        logger.info(`Filtering query for documentIds: [${documentIds.join(', ')}]`);
        if (userId) {
          const Document = require('../models/document.model');
          const docs = await Document.find({ _id: { $in: documentIds }, uploadedBy: userId }, '_id').lean();
          validDocIds = new Set(docs.map(d => d._id.toString()));
          logger.info(`Validated ${validDocIds.size} documents for user ${userId}`);
        } else {
          validDocIds = new Set(documentIds.map(String));
        }
      } else {
        logger.info('No specific documentIds selected, searching across all available knowledge.');
      }

      // Hybrid Search: BM25 (Keyword)
      let keywordBoostMap = new Map();
      if (isHybridMode) {
        try {
          const Document = require('../models/document.model');
          const keywordDocs = await Document.find(
            { $text: { $search: queryText } },
            { score: { $meta: "textScore" } }
          ).limit(20).lean();
          
          keywordDocs.forEach(doc => {
            // Normalize textScore to a boost factor between 0.1 and 0.3
            const boost = Math.min(doc.score * 0.05, 0.3);
            keywordBoostMap.set(doc._id.toString(), boost);
          });
          logger.info(`Hybrid Search: Found ${keywordDocs.length} keyword matches for boosting.`);
        } catch (e) {
          logger.warn(`Hybrid BM25 keyword search failed (index might not exist): ${e.message}`);
        }
      }

      logger.info(`Expanding query via LLM: "${queryText}"`);
      const expandedQueries = await llmService.generateExpandedQueries(queryText);
      const allQueries = [queryText, ...expandedQueries.filter(q => q.toLowerCase() !== queryText.toLowerCase())];
      logger.info(`Generated ${allQueries.length} total queries for vector search.`);

      // Execute all queries in parallel
      const mlResponses = await Promise.all(allQueries.map(q => mlService.queryVector(q)));
      
      let rawChunks = [];
      const seenChunkIdsForDedupe = new Set();

      for (const mlResponse of mlResponses) {
        const results = mlResponse?.data?.results;
        if (!results || !Array.isArray(results.documents) || results.documents.length === 0 || !Array.isArray(results.documents[0])) {
          continue;
        }

        const chunkTexts = results.documents[0] || [];
        const chunkMetadatas = results.metadatas?.[0] || [];
        const chunkIds = results.ids?.[0] || [];
        const chunkDistances = results.distances?.[0] || [];

        for (let i = 0; i < chunkTexts.length; i++) {
          const id = chunkIds[i];
          if (!id || seenChunkIdsForDedupe.has(id)) continue;
          seenChunkIdsForDedupe.add(id);

          rawChunks.push({
            text: chunkTexts[i],
            distance: chunkDistances[i],
            meta: chunkMetadatas[i] || {},
            id: id
          });
        }
      }
      
      if (rawChunks.length === 0) {
        logger.warn('No valid results found in vector store across all queries.');
        const fallbackAnswer = await llmService.generateAnswer({ query: queryText, context: "" });
        return {
          answer: fallbackAnswer || "I couldn't find an answer.",
          sources: [],
          retrieval: { topK: safeTopK, minScore: safeMinScore, totalRetrieved: 0, documentsUsed: 0, confidence: 0, hybrid: isHybridMode }
        };
      }

      // Score, Boost, and Sort
      const scoredChunks = rawChunks.map(chunk => {
        let baseScore = chunk.distance !== undefined ? Math.max(0, 1 - (chunk.distance / 2)) : 0;
        const safeDocumentId = chunk.meta.documentId || chunk.id || "unknown";
        
        let hybridBoost = 0;
        if (isHybridMode && keywordBoostMap.has(safeDocumentId.toString())) {
          hybridBoost = keywordBoostMap.get(safeDocumentId.toString());
        }
        
        return { ...chunk, score: baseScore + hybridBoost, documentId: safeDocumentId };
      }).sort((a, b) => b.score - a.score);

      let context = "";
      const sources = [];
      let usableChunksCount = 0;
      const seenChunks = new Set();
      const documentsUsed = new Set();

      let totalScore = 0;
      let highestScore = 0;

      for (let i = 0; i < scoredChunks.length; i++) {
        const chunk = scoredChunks[i];
        const text = chunk.text;
        
        if (text == null || typeof text !== 'string' || !text.trim()) continue; 

        const cleanText = text.trim();
        const score = chunk.score;
        
        if (score > highestScore) highestScore = score;

        if (score < safeMinScore) {
          continue;
        }

        const meta = chunkMetadatas[i] || {};
        const safeDocumentId = meta.documentId || chunkIds[i] || "unknown";
        
        if (validDocIds.size > 0 && !validDocIds.has(safeDocumentId.toString())) {
          continue;
        }

        if (usableChunksCount >= safeTopK) break;

        const chunkSignature = cleanText.substring(0, 50).toLowerCase();
        if (seenChunks.has(chunkSignature)) {
          continue;
        }
        seenChunks.add(chunkSignature);

        documentsUsed.add(safeDocumentId.toString());

        const safeOriginalName = meta.originalName || "unknown";
        const safeFileName = meta.fileName || "unknown";
        const safeChunkIndex = meta.chunkIndex !== undefined ? meta.chunkIndex : i;
        
        totalScore += score;

        if (isIncludeSources) {
          sources.push({
            documentId: safeDocumentId,
            title: safeOriginalName,
            filename: safeFileName,
            score: Number(score.toFixed(2)),
            chunkIndex: safeChunkIndex,
            preview: isIncludeChunks ? cleanText.substring(0, 150) + "..." : ""
          });
        }

        const nextChunkStr = `[Source ${usableChunksCount + 1}]\n${cleanText}\n\n`;
        // Soft cut to prevent overflow
        if ((context.length + nextChunkStr.length) > 4000) {
          const remaining = 4000 - context.length;
          if (remaining > 50) {
            context += nextChunkStr.substring(0, remaining) + "...";
            usableChunksCount++;
          }
          break; // Stop adding chunks once we hit the ~4000 ceiling
        } else {
          context += nextChunkStr;
          usableChunksCount++;
        }
      }

      const confidenceScore = usableChunksCount > 0 ? (totalScore / usableChunksCount) : 0;

      if (usableChunksCount === 0 || !context.trim()) {
        logger.warn(`No usable semantic chunks remained after validation. Highest score found: ${highestScore.toFixed(2)} (Threshold: ${safeMinScore})`);
        const fallbackAnswer = await llmService.generateAnswer({ query: queryText, context: "" });
        return {
          answer: fallbackAnswer || "I'm sorry, I couldn't find relevant information in the selected documents. Try lowering the similarity threshold in the RAG settings.",
          sources: [],
          retrieval: { topK: safeTopK, minScore: safeMinScore, totalRetrieved: 0, documentsUsed: 0, confidence: 0 }
        };
      }

      logger.info(`Calling LLM spanning context array payload counting: ${usableChunksCount}`);
      const answer = await llmService.generateAnswer({
        query: queryText,
        context: context.trim()
      });

      // Generate Follow-up Questions in background (non-blocking for now, or await if preferred)
      const followUpQuestions = await llmService.generateFollowUpQuestions({ query: queryText, answer: answer });

      return {
        answer: answer || "I couldn't find an answer.",
        sources,
        followUpQuestions,
        retrieval: {
          topK: safeTopK,
          minScore: safeMinScore,
          totalRetrieved: usableChunksCount,
          documentsUsed: documentsUsed.size,
          confidence: Number(confidenceScore.toFixed(2))
        }
      };
    } catch (error) {
       // Only throw unexpected system errors. Never swallow real bugs.
      logger.error(`Query processing failed internally over orchestrator: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new QueryService();
