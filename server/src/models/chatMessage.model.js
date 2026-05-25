const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sources: {
    type: Array,
    default: []
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  idempotencyKey: {
    type: String,
    sparse: true,
    index: true
  }
}, {
  timestamps: true
});

// Added compound index safely isolating sorting arrays by explicit user session roots natively
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ sessionId: 1, userId: 1 });
chatMessageSchema.index({ sessionId: 1, idempotencyKey: 1, role: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
