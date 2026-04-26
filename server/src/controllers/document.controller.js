const documentService = require('../services/document.service');

const createDocument = async (req, res) => {
  const { fileName, originalName, mimeType, size } = req.body;
  const uploadedBy = req.user ? req.user.id : undefined;

  if (!fileName || !originalName) {
    return res.status(400).json({
      success: false,
      message: "fileName and originalName are required",
      error: "Validation failed"
    });
  }

  const doc = await documentService.createDocument({
    fileName,
    originalName,
    mimeType,
    size,
    uploadedBy
  });

  res.status(201).json({
    success: true,
    data: doc,
    message: "Document created successfully"
  });
};

const getDocuments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const uploadedBy = req.user.id;
  const docs = await documentService.getDocuments({ page, limit, uploadedBy });
  
  res.status(200).json({
    success: true,
    data: docs,
    message: "Documents retrieved successfully"
  });
};

const getDocumentById = async (req, res) => {
  const doc = await documentService.getDocumentById(req.params.id);
  
  if (!doc || doc.uploadedBy !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
      error: "Not Found"
    });
  }
  
  res.status(200).json({
    success: true,
    data: doc,
    message: "Document retrieved successfully"
  });
};

const updateDocumentStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["uploaded", "processing", "completed", "failed"];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
      error: "Validation error"
    });
  }

  const doc = await documentService.updateDocumentStatus(req.params.id, status);
  
  if (!doc) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
      error: "Not Found"
    });
  }

  res.status(200).json({
    success: true,
    data: doc,
    message: "Document status updated successfully"
  });
};

const deleteDocument = async (req, res) => {
  const doc = await documentService.getDocumentById(req.params.id);

  if (!doc || doc.uploadedBy !== req.user.id) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
      error: "Not Found"
    });
  }

  await documentService.deleteDocument(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
    message: "Document deleted successfully"
  });
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocumentStatus,
  deleteDocument
};
