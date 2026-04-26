const ingestService = require('../services/ingest.service');
const documentService = require('../services/document.service');

const triggerIngest = async (req, res) => {
  const { documentId } = req.params;

  if (!documentId) {
    return res.status(400).json({
      success: false,
      message: "Ingestion failed",
      error: "Document ID is required"
    });
  }

  try {
    const result = await ingestService.ingestDocument(documentId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Ingestion completed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ingestion failed",
      error: error.message
    });
  }
};

const getIngestStatus = async (req, res) => {
  const { documentId } = req.params;

  const doc = await documentService.getDocumentById(documentId);
  if (!doc) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
      error: "Not Found"
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      id: doc._id,
      status: doc.status,
      ingestionStatus: doc.ingestionStatus,
      chunkCount: doc.chunkCount,
      ingestedAt: doc.ingestedAt,
      ingestionError: doc.ingestionError
    },
    message: "Ingest status retrieved"
  });
};

module.exports = {
  triggerIngest,
  getIngestStatus
};
