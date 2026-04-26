const Document = require('../models/document.model');
const ChatSession = require('../models/chatSession.model');
const ChatMessage = require('../models/chatMessage.model');
const Job = require('../models/job.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/v1/dashboard/summary
 * @access  Private
 */
const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. Get stats
  const [
    totalDocs,
    processedDocs,
    failedDocs,
    processingDocs,
    totalSessions,
    totalQueries
  ] = await Promise.all([
    Document.countDocuments({ uploadedBy: userId }),
    Document.countDocuments({ uploadedBy: userId, status: 'completed' }),
    Document.countDocuments({ uploadedBy: userId, status: 'failed' }),
    Document.countDocuments({ uploadedBy: userId, status: 'processing' }),
    ChatSession.countDocuments({ userId }),
    ChatMessage.countDocuments({ userId, role: 'user' })
  ]);

  // 2. Calculate Heuristics
  const aiAccuracy = totalDocs > 0 
    ? Math.round((processedDocs / (processedDocs + failedDocs || 1)) * 1000) / 10 
    : 0;

  const kbUtilization = totalDocs > 0 
    ? Math.round((processedDocs / totalDocs) * 100) 
    : 0;

  // 3. Get Recent Activity (Documents & Jobs)
  const recentDocs = await Document.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentActivity = recentDocs.map(doc => ({
    id: doc._id,
    type: 'document',
    title: doc.originalName || doc.fileName,
    subtitle: `Uploaded ${getTimeAgo(doc.createdAt)}`,
    status: mapStatusLabel(doc.status),
    createdAt: doc.createdAt,
    documentId: doc._id
  }));

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      status: {
        online: true,
        label: "Online & Ready"
      },
      stats: {
        documents: totalDocs,
        chats: totalSessions,
        queries: totalQueries,
        processedDocuments: processedDocs,
        failedDocuments: failedDocs,
        processingDocuments: processingDocs
      },
      workspace: {
        aiAccuracy: Math.min(aiAccuracy, 100),
        knowledgeBaseUtilization: Math.min(kbUtilization, 100),
        ragReady: processedDocs > 0
      },
      recentActivity
    }
  });
});

/**
 * @desc    Get recent activity list
 * @route   GET /api/v1/dashboard/recent-activity
 * @access  Private
 */
const getRecentActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 5;

  const docs = await Document.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const activity = docs.map(doc => ({
    id: doc._id,
    type: 'document',
    title: doc.originalName || doc.fileName,
    subtitle: `Uploaded ${getTimeAgo(doc.createdAt)}`,
    status: mapStatusLabel(doc.status),
    createdAt: doc.createdAt,
    documentId: doc._id
  }));

  res.status(200).json({
    success: true,
    data: activity
  });
});

// Helper: Map DB status to UI Label
function mapStatusLabel(status) {
  const mapping = {
    'completed': 'Processed',
    'processing': 'Processing',
    'failed': 'Failed',
    'uploaded': 'Queued',
    'pending': 'Queued'
  };
  return mapping[status] || 'Queued';
}

// Helper: Simple Time Ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

module.exports = {
  getSummary,
  getRecentActivity
};
