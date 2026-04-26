const chatService = require('../services/chat.service');
const { buildChatSuccessResponse } = require('../utils/chatResponseNormalizer');

const createSession = async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body || {};

  const session = await chatService.createSession({ userId, title });

  return res.status(201).json({
    success: true,
    data: session,
    message: "Chat session created successfully"
  });
};

const getSessions = async (req, res) => {
  const userId = req.user.id;
  const { page, limit } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

  const data = await chatService.listSessions({ userId, page: pageNum, limit: limitNum });

  return res.status(200).json({
    success: true,
    ...data,
    message: "Chat sessions retrieved successfully"
  });
};

const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  const { page, limit } = req.query;

  if (!sessionId || sessionId === 'undefined') {
    return res.status(200).json({
      success: true,
      messages: [],
      pagination: { total: 0, page: 1, limit: 50, pages: 0 },
      message: "No session selected"
    });
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

  const data = await chatService.listMessages({ sessionId, userId, page: pageNum, limit: limitNum });

  return res.status(200).json({
    success: true,
    ...data,
    message: "Chat messages retrieved successfully"
  });
};


const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { sessionId: paramSessionId } = req.params;
  const { 
    sessionId: bodySessionId, 
    message, 
    content, 
    model, 
    mode, 
    ragSettings, 
    idempotencyKey 
  } = req.body;

  const effectiveSessionId = (paramSessionId === 'undefined' ? null : paramSessionId) || bodySessionId;

  const result = await chatService.processChatMessage({ 
    sessionId: effectiveSessionId, 
    userId, 
    message, 
    content,
    model,
    mode,
    ragSettings,
    idempotencyKey: idempotencyKey || req.headers['x-idempotency-key'] 
  });

  return res.status(200).json(result);
};


const deleteSession = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;

  await chatService.deleteSession({ sessionId, userId });

  return res.status(200).json({
    success: true,
    data: null,
    message: "Chat session archived successfully"
  });
};

module.exports = {
  createSession,
  getSessions,
  getMessages,
  sendMessage,
  deleteSession,
  deleteAllSessions: async (req, res) => {
    const userId = req.user.id;
    const result = await chatService.deleteAllSessions(userId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "All chat sessions archived successfully"
    });
  }
};
