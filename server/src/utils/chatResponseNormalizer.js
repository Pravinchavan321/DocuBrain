/**
 * Normalizes a chat message object for consistent API responses.
 */
function normalizeMessage(message) {
  if (!message) return null;

  const raw = typeof message.toObject === "function" ? message.toObject() : message;
  const id = String(raw._id || raw.id || "");

  return {
    id: id,
    _id: id,
    sessionId: String(raw.sessionId || raw.session || ""),
    role: raw.role || (raw.isUser ? "user" : "assistant"),
    content: raw.content || raw.text || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    sources: Array.isArray(raw.sources) ? raw.sources.map(normalizeSource) : [],
    metadata: raw.metadata || {}
  };
}

/**
 * Normalizes a RAG source object.
 */
function normalizeSource(source, index = 0) {
  const raw = source || {};
  const id = String(raw.id || raw._id || raw.chunkId || `source-${index}`);
  return {
    id: id,
    _id: id,
    title: raw.title || raw.documentTitle || raw.fileName || "Untitled source",
    documentName: raw.documentName || raw.fileName || raw.title || "Unknown document",
    snippet: raw.snippet || raw.chunkText || raw.text || raw.content || "",
    score: typeof raw.score === "number" ? raw.score : null,
    pageNumber: raw.pageNumber || raw.page || null,
    metadata: raw.metadata || {}
  };
}

/**
 * Normalizes a chat session object.
 */
function normalizeSession(session) {
  if (!session) return null;

  const raw = typeof session.toObject === "function" ? session.toObject() : session;
  const id = String(raw._id || raw.id || "");

  return {
    id: id,
    _id: id,
    title: raw.title || "New Chat",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
    messageCount: raw.messageCount || 0,
    lastMessagePreview: (raw.lastMessagePreview || "").slice(0, 100)
  };
}

/**
 * Builds a consistent success response for chat message operations.
 */
function buildChatSuccessResponse({ session, userMessage, assistantMessage }) {
  const normalizedSession = normalizeSession(session);
  const normalizedUserMessage = normalizeMessage(userMessage);
  const normalizedAssistantMessage = normalizeMessage(assistantMessage);

  return {
    success: true,
    sessionId: normalizedSession?.id || normalizedAssistantMessage?.sessionId,
    session: normalizedSession,
    userMessage: normalizedUserMessage,
    assistantMessage: normalizedAssistantMessage,

    // Backward-compatible fields
    message: normalizedAssistantMessage,
    messages: [normalizedUserMessage, normalizedAssistantMessage].filter(Boolean),
    answer: normalizedAssistantMessage?.content || "",
    sources: normalizedAssistantMessage?.sources || []
  };
}

/**
 * Generates a safe title from the first user message.
 */
function createTitleFromMessage(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "New Chat";
  return clean.length > 48 ? clean.slice(0, 48) + "..." : clean;
}

module.exports = {
  normalizeMessage,
  normalizeSource,
  normalizeSession,
  buildChatSuccessResponse,
  createTitleFromMessage
};
