const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.use(protect);

router.post('/sessions', asyncHandler(chatController.createSession));
router.get('/sessions', asyncHandler(chatController.getSessions));
router.delete('/sessions/:sessionId', asyncHandler(chatController.deleteSession));
router.delete('/sessions', asyncHandler(chatController.deleteAllSessions));

router.get('/sessions/:sessionId/messages', asyncHandler(chatController.getMessages));
router.post('/sessions/:sessionId/messages', authLimiter, asyncHandler(chatController.sendMessage));
router.post('/message', authLimiter, asyncHandler(chatController.sendMessage));

module.exports = router;