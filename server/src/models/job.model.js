const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    index: true
  },
  type: {
    type: String,
    enum: ['document_processing', 'embedding', 'query'],
    default: 'document_processing'
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued',
    index: true
  },
  progress: {
    type: Number,
    default: 0
  },
  error: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for dashboard recent activity
jobSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
