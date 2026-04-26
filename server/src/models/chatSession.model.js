const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
    trim: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active"
  }
}, {
  timestamps: true
});

// Optimized indexing matching querying behaviors mapped for listing endpoints natively
chatSessionSchema.index({ userId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
