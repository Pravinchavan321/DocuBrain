const mlService = require('./ml.service');
const llmService = require('./llm.service');
const logger = require('../config/logger');

class QueryService {
  async processQuery(queryText, options = {}, userId = null) {
    try {
      const { documentIds, topK, minScore, includeSources, includeChunks } = options || {};
      
      const safeTopK = Math.min(Math.max(Number(topK) || 5, 1), 10);
      const safeMinScore = isNaN(Number(minScore)) ? 0.1 : Math.min(Math.max(Number(minScore), 0), 1);
      const isIncludeSources = includeSources !== false;
      const isIncludeChunks = includeChunks !== false;

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

      logger.info(`Sending query to ML service: "${queryText}"`);
      const mlResponse = await mlService.queryVector(queryText);
      
      const results = mlResponse?.data?.results;
      
      if (!results || !Array.isArray(results.documents) || results.documents.length === 0 || !Array.isArray(results.documents[0]) || results.documents[0].length === 0) {
        logger.warn('No valid results found in vector store or malformed ML response received.');
        const fallbackAnswer = await llmService.generateAnswer({ query: queryText, context: "" });
        return {
          answer: fallbackAnswer || "I couldn't find an answer.",
          sources: [],
          retrieval: { topK: safeTopK, minScore: safeMinScore, totalRetrieved: 0, documentsUsed: 0, confidence: 0 }
        };
      }

      const chunkTexts = results.documents[0];
      const chunkMetadatas = results.metadatas?.[0] || [];
      const chunkIds = results.ids?.[0] || [];
      const chunkDistances = results.distances?.[0] || [];

      const threshold = parseFloat(process.env.VECTOR_DISTANCE_THRESHOLD || '1.2');

      let context = "";
      const sources = [];
      let usableChunksCount = 0;
      const seenChunks = new Set();
      const documentsUsed = new Set();

      let totalScore = 0;
      let highestScore = 0;

      for (let i = 0; i < chunkTexts.length; i++) {
        const text = chunkTexts[i];
        
        if (text == null || typeof text !== 'string' || !text.trim()) {
           continue; 
        }

        const cleanText = text.trim();
        const distance = chunkDistances[i];
        const score = distance !== undefined ? Math.max(0, 1 - (distance / 2)) : 0;
        
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

      return {
        answer: answer || "I couldn't find an answer.",
        sources,
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
