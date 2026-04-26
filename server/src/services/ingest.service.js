const documentService = require('./document.service');
const mlService = require('./ml.service');
const { extractTextFromFile } = require('../utils/textExtractor.util');
const { chunkText } = require('../utils/chunker.util');
const path = require('path');
const logger = require('../config/logger');

class IngestService {
  async ingestDocument(documentId) {
    try {
      // 1. Fetch document
      const doc = await documentService.getDocumentById(documentId);
      if (!doc) {
        throw new Error('Document not found');
      }

      if (doc.ingestionStatus === 'completed') {
        throw new Error('Document is already ingested');
      }

      // Mark processing
      await documentService.updateIngestionState(documentId, {
        status: 'processing',
        ingestionStatus: 'processing',
        ingestionError: null
      });

      // 2. Build physical path relative to the runtime
      const physicalPath = path.join(__dirname, '../../uploads', doc.fileName);

      // 3. Extract text
      logger.info(`Starting extraction for ${doc.fileName}`);
      const text = await extractTextFromFile(physicalPath, doc.mimeType, doc.originalName);

      if (!text || !text.trim()) {
        throw new Error('Extracted text is empty');
      }

      // 4. Chunk text
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        throw new Error('No chunks generated after extraction');
      }
      logger.info(`Extracted text properly, generated ${chunks.length} chunks for ${doc.fileName}`);

      // 5. Send chunks to ML Service
      for (const chunk of chunks) {
        const chunkId = `${documentId}_chunk_${chunk.index}`;
        await mlService.storeChunk({
          id: chunkId,
          text: chunk.text,
          metadata: {
            documentId: documentId.toString(),
            chunkIndex: chunk.index,
            originalName: doc.originalName,
            uploadedBy: doc.uploadedBy ? doc.uploadedBy.toString() : 'unknown',
            mimeType: doc.mimeType,
            fileName: doc.fileName
          }
        });
      }
      logger.info(`Successfully stored ${chunks.length} chunks in ML Service for ${doc.fileName}`);

      // 6. Update document success state
      const previewText = text.substring(0, 500);
      const finalDoc = await documentService.updateIngestionState(documentId, {
        status: 'completed',
        ingestionStatus: 'completed',
        chunkCount: chunks.length,
        extractedText: previewText,
        ingestedAt: new Date()
      });

      return finalDoc;
    } catch (error) {
      logger.error(`Ingestion failed for document ${documentId}: ${error.message}`);
      await documentService.updateIngestionState(documentId, {
        status: 'failed',
        ingestionStatus: 'failed',
        ingestionError: error.message
      });
      throw error;
    }
  }
}

module.exports = new IngestService();
