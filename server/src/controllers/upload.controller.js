const documentService = require('../services/document.service');
const ingestService = require('../services/ingest.service');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

const handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Upload failed",
      error: "No file was uploaded or file type is not supported"
    });
  }

  try {
    const { filename, originalname, mimetype, size } = req.file;
    const uploadedBy = req.user ? req.user.id : undefined;
    const status = req.body.status || 'uploaded';
    
    const filePath = `/uploads/${filename}`;

    const docMetadata = {
      fileName: filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      uploadedBy,
      status,
      filePath
    };

    const doc = await documentService.createDocument(docMetadata);
    
    // Automatically trigger ingestion in background
    ingestService.ingestDocument(doc._id).catch(err => {
      logger.error(`Automatic ingestion failed for doc ${doc._id}: ${err.message}`);
    });

    res.status(201).json({
      success: true,
      data: doc,
      message: "File uploaded successfully and ingestion started"
    });
  } catch (error) {
    logger.error(`Document save failed: ${error.message}`);
    // Cleanup orphaned physical file
    const physicalPath = path.join(__dirname, '../../uploads', req.file.filename);
    if (fs.existsSync(physicalPath)) {
      fs.unlinkSync(physicalPath);
    }
    
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message || "Failed to save document metadata"
    });
  }
};

module.exports = {
  handleUpload
};
