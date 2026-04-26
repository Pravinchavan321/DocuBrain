# DocuBrain — API Contracts
> ALWAYS paste this file at the start of every AI coding session.
> Use EXACT endpoint paths, request/response shapes. Never invent new endpoints.

---

## Express API (Node.js) — Base: /api/v1

### Auth Routes

#### POST /api/v1/auth/register
Request:
```json
{ "email": "string", "password": "string (min 8)", "full_name": "string" }
```
Response 201:
```json
{ "success": true, "message": "Verification email sent", "data": { "user_id": "uuid" } }
```

#### POST /api/v1/auth/login
Request:
```json
{ "email": "string", "password": "string" }
```
Response 200:
```json
{
  "success": true,
  "data": {
    "access_token": "jwt string",
    "refresh_token": "jwt string",
    "user": { "id": "uuid", "email": "string", "full_name": "string", "role": "string" }
  }
}
```

#### POST /api/v1/auth/refresh
Request:
```json
{ "refresh_token": "string" }
```
Response 200:
```json
{ "success": true, "data": { "access_token": "string" } }
```

#### POST /api/v1/auth/logout
Headers: Authorization: Bearer {token}
Request:
```json
{ "refresh_token": "string" }
```
Response 200:
```json
{ "success": true, "message": "Logged out" }
```

---

### Knowledge Base Routes
All require: Authorization: Bearer {token}

#### GET /api/v1/knowledge-bases?page=1&limit=20
Response 200:
```json
{
  "success": true,
  "data": {
    "knowledge_bases": [{ "id": "uuid", "name": "string", "description": "string", "document_count": 0, "created_at": "date" }],
    "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 }
  }
}
```

#### POST /api/v1/knowledge-bases
Request:
```json
{ "name": "string", "description": "string (optional)", "is_public": false }
```
Response 201:
```json
{ "success": true, "data": { "knowledge_base": { "id": "uuid", "name": "string" } } }
```

#### DELETE /api/v1/knowledge-bases/:id
Response 200:
```json
{ "success": true, "message": "Knowledge base deleted" }
```

---

### Document Routes
All require: Authorization: Bearer {token}

#### POST /api/v1/documents/upload
Request: multipart/form-data
```
file: File (PDF/DOCX/TXT, max 50MB)
knowledge_base_id: string (UUID)
```
Response 201:
```json
{
  "success": true,
  "data": {
    "document_id": "uuid",
    "job_id": "mongodb_objectid",
    "status": "pending",
    "message": "Document queued for processing"
  }
}
```

#### GET /api/v1/documents?knowledge_base_id=uuid&page=1&limit=20
Response 200:
```json
{
  "success": true,
  "data": {
    "documents": [{
      "id": "uuid",
      "original_name": "string",
      "file_type": "string",
      "file_size_bytes": 0,
      "status": "string",
      "chunk_count": 0,
      "created_at": "date"
    }],
    "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 }
  }
}
```

#### GET /api/v1/documents/:id/status
Response 200:
```json
{ "success": true, "data": { "status": "pending|processing|done|failed", "chunk_count": 0, "error_message": null } }
```

#### DELETE /api/v1/documents/:id
Response 200:
```json
{ "success": true, "message": "Document deleted" }
```

---

### Chat Routes
All require: Authorization: Bearer {token}

#### POST /api/v1/chat/query
Request:
```json
{
  "question": "string",
  "knowledge_base_id": "uuid",
  "session_id": "uuid (optional, creates new if not provided)"
}
```
Response 200:
```json
{
  "success": true,
  "data": {
    "answer": "string",
    "session_id": "uuid",
    "sources": [
      {
        "document_id": "uuid",
        "original_name": "string",
        "chunk_index": 0,
        "page_number": 1,
        "relevance_score": 0.95,
        "excerpt": "string (first 200 chars of chunk)"
      }
    ],
    "cached": false
  }
}
```

#### GET /api/v1/chat/history?knowledge_base_id=uuid&session_id=uuid&page=1&limit=20
Response 200:
```json
{
  "success": true,
  "data": {
    "messages": [{ "role": "user|assistant", "content": "string", "sources": [], "created_at": "date" }],
    "pagination": { "page": 1, "limit": 20, "total": 0, "pages": 0 }
  }
}
```

#### GET /api/v1/chat/sessions?knowledge_base_id=uuid
Response 200:
```json
{
  "success": true,
  "data": {
    "sessions": [{ "session_id": "uuid", "message_count": 0, "last_message_at": "date" }]
  }
}
```

---

## FastAPI ML Service — Base: /ml/v1

### POST /ml/v1/ingest
Called by Express after document upload.
Request:
```json
{
  "job_id": "mongodb_objectid_string",
  "document_id": "uuid",
  "knowledge_base_id": "uuid",
  "gridfs_file_id": "mongodb_objectid_string",
  "file_type": "pdf|docx|txt"
}
```
Response 200:
```json
{ "success": true, "message": "Ingestion started", "job_id": "string" }
```

### POST /ml/v1/query
Called by Express for every user question.
Request:
```json
{
  "question": "string",
  "knowledge_base_id": "uuid",
  "chat_history": [{ "role": "user|assistant", "content": "string" }]
}
```
Response 200:
```json
{
  "success": true,
  "data": {
    "answer": "string",
    "sources": [
      {
        "document_id": "string",
        "original_name": "string",
        "chunk_index": 0,
        "page_number": 1,
        "relevance_score": 0.95,
        "excerpt": "string"
      }
    ]
  }
}
```

### GET /ml/v1/health
Response 200:
```json
{ "status": "ok", "chromadb": "ok", "embedder": "ok", "gemini": "ok" }
```

### GET /ml/v1/job/:job_id
Response 200:
```json
{ "job_id": "string", "status": "pending|processing|done|failed", "error": null }
```

---

## Socket.io Events

### Server → Client (Emits)
```
job:queued      → { job_id, document_id, document_name }
job:processing  → { job_id, document_id }
job:done        → { job_id, document_id, chunk_count }
job:failed      → { job_id, document_id, error }
```

### Client → Server (Listens)
```
join:room       → { user_id }   (join personal room on connect)
```
