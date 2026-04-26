# DocuBrain — Architecture Reference
> ALWAYS paste this file at the start of every AI coding session.

## What This App Does
DocuBrain is an enterprise RAG (Retrieval Augmented Generation) knowledge base.
Users upload documents (PDF/DOCX/TXT), ask questions in plain English, and get
precise answers with source citations powered by Gemini AI.

## Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + Socket.io client |
| Backend | Node.js + Express.js + Socket.io |
| ML Service | FastAPI (Python) |
| Primary DB | PostgreSQL (Supabase) |
| Document DB + Files + Queue | MongoDB + GridFS |
| AI/LLM | Gemini API |
| Orchestration | LangChain + LangGraph |
| Embeddings | Sentence Transformers (all-MiniLM-L6-v2) |
| Vector Store | ChromaDB |
| Cache | node-cache |
| Containers | Docker + Docker Compose |

## Two Backend Services
- **Express (Node)** → Auth, file uploads, business logic, user management
- **FastAPI (Python)** → All AI/ML: embeddings, RAG pipeline, LangGraph agent

## Port Map
| Service | Port |
|---|---|
| React | 3000 |
| Express | 5000 |
| FastAPI | 8000 |
| PostgreSQL | 5432 |
| MongoDB | 27017 |
| ChromaDB | 8001 |

## API Conventions
- All Express routes prefixed: `/api/v1`
- All FastAPI routes prefixed: `/ml/v1`
- Success response: `{ success: true, data: {}, message: "" }`
- Error response: `{ success: false, message: "", error: "" }`
- All list endpoints MUST have pagination: `?page=1&limit=20`
- JWT access token: 15min expiry
- JWT refresh token: 7 days expiry, stored in PostgreSQL sessions table

## Data Flow
```
User uploads PDF
→ Express: validates, stores in MongoDB GridFS, creates job in MongoDB jobs collection
→ Socket.io: emits "job:queued" to user
→ FastAPI: polls jobs collection, picks up pending job
→ FastAPI: LangChain loads file from GridFS, splits into chunks
→ FastAPI: Sentence Transformers embeds each chunk
→ FastAPI: ChromaDB stores vectors, MongoDB stores chunks with metadata
→ FastAPI: updates job status to "done"
→ Express: Socket.io emits "job:done" to user

User asks question
→ Express: receives query, checks node-cache for identical query
→ Express: calls FastAPI /ml/v1/query
→ FastAPI: LangGraph agent → embed query → ChromaDB similarity search → grade chunks → Gemini generates answer
→ FastAPI: returns answer + source citations
→ Express: caches result in node-cache, saves to MongoDB chats, returns to user
```

## Environment Variables (NEVER hardcode these)
See .env.example for all required variables.
All process.env calls must have a fallback or throw on missing.

## Non-Negotiables
- ALWAYS use async/await with try/catch
- ALWAYS validate inputs before DB operations (express-validator)
- ALWAYS paginate list endpoints
- NEVER install new packages without stating them explicitly
- NEVER modify files outside the stated task scope
- NEVER use console.log — use Winston logger (Node) or Loguru (Python)
- ALWAYS return consistent response shape
- ALWAYS check if file/function already exists before creating
