const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
  },
  size: {
    type: Number,
  },
  uploadedBy: {
    type: String,
  },
  status: {
    type: String,
    enum: ["uploaded", "processing", "completed", "failed"],
    default: "uploaded",
  },
  filePath: {
    type: String,
  },
  extractedText: {
    type: String,
  },
  chunkCount: {
    type: Number,
    default: 0,
  },
  ingestionStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  ingestionError: {
    type: String,
  },
  ingestedAt: {
    type: Date,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
