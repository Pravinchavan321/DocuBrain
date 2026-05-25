const mongoose = require('mongoose');
const ChatSession = require('../models/chatSession.model');
const ChatMessage = require('../models/chatMessage.model');
const queryService = require('./query.service');
const logger = require('../config/logger');
const { BadRequestError, NotFoundError, AppError, GatewayTimeoutError } = require('../utils/AppError');

const { 
  normalizeMessage, 
  normalizeSession, 
  buildChatSuccessResponse,
  createTitleFromMessage 
} = require('../utils/chatResponseNormalizer');

// Input Sanitizer 
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace(/\s+/g, ' ').trim();
};

// Constants
const RATE_LIMIT_WINDOW_MS = 10000;
const MAX_MESSAGES_PER_WINDOW = 5;
const RAG_TIMEOUT_MS = 15000;
const MAX_MESSAGE_LENGTH = 2000;

// State
const rateLimitMap = new Map();

// Constants for Quick Actions and Models
const QUICK_ACTION_PROMPTS = {
  ai_pdf_chat: "Answer using uploaded documents when available. Cite sources clearly with [Source Name] format.",
  research_assistant: "Provide structured research-style answers with clear reasoning, citations, and detailed analysis.",
  coding_assistant: "Provide practical coding help with clean explanations, best practices, and code blocks.",
  essay_writer: "Help draft structured, polished writing with academic tone and logical flow.",
  business: "Respond with business-focused clarity, professional tone, and concise recommendations.",
  translate: "Translate or rewrite text clearly into the requested language while preserving tone.",
  youtube_summary: "Summarize the key points of the provided transcript or video context with bullet points.",
  email_writer: "Write professional emails with clear subject lines, appropriate tone, and clear call-to-action."
};

const ALLOWED_MODELS = [
  "default",
  "gpt-4.5-mini",
  "gpt-4o-mini",
  "llama-3.1",
  "gemini-2.5-flash",
  "local"
];

class ChatService {
  async createSession({ userId, title }) {
    if (!userId) throw new BadRequestError('User ID is required');

    const safeTitle = sanitizeInput(title || "New Chat");
    const session = await ChatSession.create({
      userId,
      title: safeTitle,
      status: 'active',
      lastMessageAt: new Date()
    });
    logger.info(`Chat session created: session=${session._id} user=${userId}`);
    return session;
  }

  async getSessionById(sessionId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new BadRequestError('Invalid session ID format');
    }
    const session = await ChatSession.findOne({ _id: sessionId, status: 'active' });
    if (!session) throw new NotFoundError('Chat session not found');
    return session;
  }

  async verifySessionOwnership(sessionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new BadRequestError('Invalid session ID format');
    }
    
    const session = await ChatSession.findOne({ _id: sessionId, userId, status: 'active' });
    if (!session) {
      throw new NotFoundError('Chat session not found');
    }
    
    return session;
  }

  async listSessions({ userId, page = 1, limit = 20 }) {
    if (!userId) throw new BadRequestError('User ID is required');

    const skip = (page - 1) * limit;
    
    const [sessions, total] = await Promise.all([
      ChatSession.find({ userId, status: 'active' })
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChatSession.countDocuments({ userId, status: 'active' })
    ]);

    return {
      sessions: sessions.map(normalizeSession),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async listMessages({ sessionId, userId, page = 1, limit = 50 }) {
    const session = await this.verifySessionOwnership(sessionId, userId);

    const skip = (page - 1) * limit;
    
    const query = { sessionId: session._id, userId };
    
    const [messages, total] = await Promise.all([
      ChatMessage.find(query)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChatMessage.countDocuments(query)
    ]);

    logger.info(`Chat messages listed: session=${session._id} user=${userId}`);

    return {
      messages: messages.map(normalizeMessage),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async processChatMessage({ sessionId, userId, message, content, model, mode, ragSettings = {}, idempotencyKey }) {
    const userText = sanitizeInput(message || content);
    if (!userText) {
      throw new BadRequestError('Message cannot be empty');
    }
    if (userText.length > MAX_MESSAGE_LENGTH) {
      throw new BadRequestError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters limit)`);
    }

    // 1. Resolve Session (or Create if missing)
    let sessionDoc;
    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      sessionDoc = await this.verifySessionOwnership(sessionId, userId);
    } else {
      sessionDoc = await this.createSession({ 
        userId, 
        title: createTitleFromMessage(userText) 
      });
      logger.info(`Auto-created session for new chat: session=${sessionDoc._id} user=${userId}`);
    }

    // 2. Rate Limit Guard
    const now = Date.now();
    const userTimestamps = rateLimitMap.get(userId) || [];
    const validTimestamps = userTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length >= MAX_MESSAGES_PER_WINDOW) {
      throw new AppError("Too many requests. Please slow down.", 429);
    }
    validTimestamps.push(now);
    rateLimitMap.set(userId, validTimestamps);

    // 3. Idempotency Check
    if (idempotencyKey) {
      const existingUserMsg = await ChatMessage.findOne({ sessionId: sessionDoc._id, idempotencyKey, role: 'user' });
      if (existingUserMsg) {
        const existingAssistantMsg = await ChatMessage.findOne({ sessionId: sessionDoc._id, idempotencyKey, role: 'assistant' });
        if (existingAssistantMsg) {
          return buildChatSuccessResponse({ 
            session: sessionDoc, 
            userMessage: existingUserMsg, 
            assistantMessage: existingAssistantMsg 
          });
        }
      }
    }

    // 4. Handle Quick Action & Model Fallbacks
    const quickActionPrompt = QUICK_ACTION_PROMPTS[mode] || "";
    const safeModel = ALLOWED_MODELS.includes(model) ? model : "gemini-2.5-flash";

    // 5. Call RAG Model externally
    let ragResponse = { answer: "", sources: [], retrieval: { totalRetrieved: 0 } };
    const startTime = Date.now();
    const ragWarnings = [];

    try {
      // Enhance options with mode and model
      const queryOptions = { 
        ...ragSettings, 
        mode, 
        model: safeModel,
        systemInstruction: quickActionPrompt 
      };
      
      const ragPromise = queryService.processQuery(userText, queryOptions, userId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new GatewayTimeoutError('Query Service timeout exceeded')), RAG_TIMEOUT_MS)
      );
      
      const successfulResponse = await Promise.race([ragPromise, timeoutPromise]);
      ragResponse.answer = successfulResponse.answer;
      ragResponse.sources = successfulResponse.sources;
      ragResponse.retrieval = successfulResponse.retrieval;
      ragResponse.followUpQuestions = successfulResponse.followUpQuestions;
    } catch (error) {
      ragWarnings.push("Intelligence retrieval was limited for this response.");
      logger.error(`RAG failure: ${error.message}`);
      // Fallback content if everything fails
      if (!ragResponse.answer) {
        ragResponse.answer = "I'm having trouble accessing the specific documents right now, but I'm here to help with general questions!";
      }
    }

    // 6. Persist Messages
    try {
      const [userMessage] = await ChatMessage.create([{
        sessionId: sessionDoc._id,
        userId,
        role: 'user',
        content: userText,
        metadata: { idempotencyKey, quickAction: mode },
        createdAt: new Date()
      }]);

      const [assistantMessage] = await ChatMessage.create([{
        sessionId: sessionDoc._id,
        userId,
        role: 'assistant',
        content: ragResponse.answer,
        sources: ragResponse.sources || [],
        metadata: { 
          retrieval: ragResponse.retrieval,
          followUpQuestions: ragResponse.followUpQuestions || [],
          model: safeModel,
          requestedModel: model,
          quickAction: mode,
          warnings: ragWarnings,
          idempotencyKey
        },
        createdAt: new Date()
      }]);

      // Update session metadata
      sessionDoc.lastMessageAt = new Date();
      if (!sessionDoc.title || sessionDoc.title === "New Chat") {
        sessionDoc.title = createTitleFromMessage(userText);
      }
      await sessionDoc.save();

      return buildChatSuccessResponse({ 
        session: sessionDoc, 
        userMessage, 
        assistantMessage 
      });
    } catch (error) {
      logger.error(`Failed to save chat messages: ${error.message}`);
      throw new AppError("System failed to save conversation.", 500);
    }
  }

  async deleteSession({ sessionId, userId }) {
    const session = await this.verifySessionOwnership(sessionId, userId);
    session.status = "archived";
    await session.save();
    return true;
  }

  async deleteAllSessions(userId) {
    if (!userId) throw new BadRequestError('User ID is required');
    
    // We update all active sessions to archived for this user
    const result = await ChatSession.updateMany(
      { userId, status: 'active' },
      { $set: { status: 'archived' } }
    );
    
    logger.info(`All chat sessions archived for user: user=${userId} count=${result.modifiedCount}`);
    return { deletedCount: result.modifiedCount };
  }
}


module.exports = new ChatService();
