# DocuBrain — AI Agent Session Starter
> Copy this ENTIRE file and paste at the start of EVERY AI coding conversation.
> Fill in the [BRACKETS] before pasting.

---

## PASTE THIS AT START OF EVERY SESSION:

```
=== DOCUBRAIN PROJECT CONTEXT ===

You are a senior full-stack engineer working on DocuBrain — an enterprise RAG knowledge base app.
Read every section below carefully before writing any code.

--- STACK ---
Frontend:  React.js + Socket.io client (port 3000)
Backend:   Node.js + Express.js + Socket.io (port 5000)
ML:        FastAPI Python (port 8000)
DB1:       PostgreSQL via Supabase (primary data)
DB2:       MongoDB Atlas + GridFS (files, chunks, jobs, chat history)
AI:        Gemini API (Google AI Studio free tier)
RAG:       LangChain + LangGraph
Embeddings: Sentence Transformers (all-MiniLM-L6-v2)
Vectors:   ChromaDB (port 8001)
Cache:     node-cache (in-memory)
Infra:     Docker + Docker Compose

--- CONVENTIONS (NEVER BREAK THESE) ---
- API prefix: /api/v1 (Express), /ml/v1 (FastAPI)
- Success: { success: true, data: {}, message: "" }
- Error:   { success: false, message: "", error: "" }
- All list endpoints MUST have ?page=1&limit=20 pagination
- JWT: access token 15min, refresh token 7 days
- ALWAYS async/await + try/catch
- NEVER console.log → use Winston (Node) or Loguru (Python)
- NEVER hardcode secrets → always process.env / os.environ
- NEVER install packages without listing them first
- NEVER touch files outside the task scope

--- CURRENT FILE TREE ---
[PASTE OUTPUT OF: find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/__pycache__/*' | head -80]

--- RELEVANT EXISTING CODE ---
[PASTE THE ACTUAL CODE of files related to your task]
Example: If building chat, paste chat.controller.js, chat.service.js, Chat.model.js

--- DATABASE SCHEMA (exact field names) ---
PostgreSQL tables: users, sessions, knowledge_bases, documents, audit_logs
MongoDB collections: jobs, chunks, chats
(See DATABASE_SCHEMA.md for full schema — paste relevant parts here)

--- ENV VARIABLES AVAILABLE ---
# Server
PORT, NODE_ENV, CLIENT_URL
# DBs
DATABASE_URL, MONGODB_URI
# AI
GEMINI_API_KEY
# Auth
JWT_SECRET, JWT_REFRESH_SECRET
# Email
GMAIL_USER, GMAIL_PASS
# ML
ML_SERVICE_URL (=http://fastapi:8000)
CHROMA_HOST, CHROMA_PORT
# Monitoring
SENTRY_DSN_NODE, SENTRY_DSN_PYTHON

=== TASK ===
[DESCRIBE YOUR SPECIFIC TASK HERE]

Use this exact format:
CONTEXT: [what already exists related to this task]
TASK: [one specific thing to build]
CONSTRAINTS: [anything the AI must not do]
OUTPUT: [exact file(s) you want created or modified]
```

---

## TASK PROMPT EXAMPLES

### Example 1 — Building a new route
```
CONTEXT:
- auth.middleware.js exists at server/src/middleware/auth.middleware.js
- Document model exists at server/src/models/mongo/Document.model.js
- PostgreSQL documents table exists (see DATABASE_SCHEMA.md)
- gridfs.js helper exists at server/src/utils/gridfs.js with uploadToGridFS(buffer, filename, contentType, metadata)

TASK:
Build POST /api/v1/documents/upload route.

CONSTRAINTS:
- Use Multer memoryStorage (already in upload.middleware.js)
- Max file size 50MB
- Only allow pdf, docx, txt MIME types
- Store file in MongoDB GridFS using existing gridfs.js uploadToGridFS helper
- Insert document record into PostgreSQL documents table
- Create job in MongoDB jobs collection
- Emit Socket.io job:queued event using socket.service.js
- Do NOT create any new utility files
- Do NOT modify any existing files except document.routes.js

OUTPUT:
1. server/src/controllers/document.controller.js (uploadDocument function only)
2. server/src/services/document.service.js (uploadDocument function only)
3. Modification to server/src/routes/document.routes.js (add the POST route)
```

### Example 2 — Building ML pipeline
```
CONTEXT:
- embedder.py exists at ml/app/services/embedder.py with get_embedder() singleton
- vectorstore.py exists at ml/app/services/vectorstore.py with get_or_create_collection(kb_id)
- gridfs_reader.py exists with read_file_from_gridfs(gridfs_file_id) → returns bytes
- request_models.py has IngestRequest pydantic model
- MongoDB jobs collection schema: { _id, document_id, knowledge_base_id, gridfs_file_id, file_type, status, error }

TASK:
Build the ingest pipeline at ml/app/pipelines/ingest_pipeline.py

CONSTRAINTS:
- Use LangChain PyPDFLoader for PDF, Docx2txtLoader for DOCX, TextLoader for TXT
- Chunk size 1000, overlap 200
- Use existing embedder singleton — do NOT create a new one
- Store vectors in ChromaDB using existing vectorstore.py
- Store chunk metadata in MongoDB chunks collection
- Update job status in MongoDB jobs collection throughout
- Use Loguru for all logging

OUTPUT:
ml/app/pipelines/ingest_pipeline.py (complete file)
```

### Example 3 — Fixing a bug
```
CONTEXT:
Paste the ACTUAL broken code here.

TASK:
Fix: [exact error message or behavior]

CONSTRAINTS:
- Only modify the broken function
- Do not refactor anything else

OUTPUT:
Show only the fixed function with file path and line numbers
```

---

## WHAT TO PASTE EACH SESSION — QUICK CHECKLIST

```
✅ This SESSION_STARTER.md (the top section)
✅ Current file tree output
✅ ARCHITECTURE.md (first session or when confused)
✅ DATABASE_SCHEMA.md relevant sections
✅ API_CONTRACTS.md relevant sections
✅ Actual existing code files related to task
✅ Specific task using CONTEXT/TASK/CONSTRAINTS/OUTPUT format
```

## WHAT NEVER TO DO

```
❌ Never say "build the auth system" — too vague
❌ Never say "you know the stack" — always include context
❌ Never skip pasting existing code — AI will invent different implementations
❌ Never ask for multiple features in one session — one task at a time
❌ Never skip the OUTPUT section — AI won't know what files to create
```

---

## BUILD ORDER (Follow This Sequence)

### Phase 1 — Foundation
```
1.  docker-compose.yml + all Dockerfiles
2.  .env.example
3.  server/src/config/ (db.postgres.js, db.mongo.js, logger.js, env.js)
4.  server/src/app.js + server.js
5.  ml/app/main.py + config.py
6.  PostgreSQL migrations (create all tables)
7.  Health check endpoints (/api/v1/health, /ml/v1/health)
```

### Phase 2 — Auth
```
8.  server/src/middleware/auth.middleware.js
9.  server/src/validators/auth.validator.js
10. server/src/services/auth.service.js
11. server/src/controllers/auth.controller.js
12. server/src/routes/auth.routes.js
13. client: AuthContext, axiosInstance with refresh interceptor, Login/Register pages
```

### Phase 3 — ML Foundation
```
14. ml/app/services/embedder.py (Sentence Transformers singleton)
15. ml/app/services/vectorstore.py (ChromaDB client)
16. ml/app/utils/mongo.py (MongoDB connection)
17. ml/app/services/gridfs_reader.py
```

### Phase 4 — Document Upload + Ingestion
```
18. server/src/utils/gridfs.js
19. server/src/models/mongo/Job.model.js + Document.model.js
20. server/src/services/document.service.js
21. server/src/controllers/document.controller.js
22. ml/app/pipelines/ingest_pipeline.py
23. ml/app/services/job_worker.py
24. ml/app/api/ingest.py
25. Socket.io events (job status updates)
26. client: DocumentUploader + ProcessingStatus components
```

### Phase 5 — RAG Query
```
27. ml/app/graph/state.py + nodes.py + rag_graph.py (LangGraph)
28. ml/app/pipelines/rag_pipeline.py
29. ml/app/api/query.py
30. server/src/utils/cache.js + geminiRetry.js
31. server/src/services/chat.service.js + ml.service.js
32. server/src/controllers/chat.controller.js
33. server/src/models/mongo/Chat.model.js
34. client: ChatWindow + ChatMessage + SourceCitation components
```

### Phase 6 — Knowledge Base Management
```
35. server: KB routes, controller, service
36. client: KB list, create, delete UI
```

### Phase 7 — Polish
```
37. Rate limiting middleware
38. Audit logging
39. Email verification (Nodemailer)
40. Error boundaries (React)
41. CI/CD (GitHub Actions)
```
