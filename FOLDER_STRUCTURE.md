# DocuBrain — Complete Folder Structure
> ALWAYS paste this file at the start of every AI coding session.
> This is the SOURCE OF TRUTH for file locations.
> NEVER create files outside this structure without asking.

```
docubrain/
│
├── docker-compose.yml                  # Starts all 6 containers
├── .env                                # Your actual secrets (never commit)
├── .env.example                        # Template (commit this)
├── .gitignore
├── README.md
│
├── ARCHITECTURE.md                     # This stack + conventions (feed to AI)
├── FOLDER_STRUCTURE.md                 # This file (feed to AI)
├── DATABASE_SCHEMA.md                  # All tables + collections (feed to AI)
├── API_CONTRACTS.md                    # All endpoints input/output (feed to AI)
├── SESSION_STARTER.md                  # Master prompt template (feed to AI)
│
├── client/                             # React Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env                            # VITE_API_URL, VITE_ML_URL
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── socket.js                   # Socket.io client singleton
│       │
│       ├── api/                        # All API call functions
│       │   ├── auth.api.js
│       │   ├── documents.api.js
│       │   ├── knowledgeBase.api.js
│       │   └── chat.api.js
│       │
│       ├── components/                 # Reusable UI components
│       │   ├── common/
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Loader.jsx
│       │   │   ├── Toast.jsx
│       │   │   └── ErrorBoundary.jsx
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── Layout.jsx
│       │   ├── auth/
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   ├── documents/
│       │   │   ├── DocumentUploader.jsx
│       │   │   ├── DocumentList.jsx
│       │   │   ├── DocumentCard.jsx
│       │   │   └── ProcessingStatus.jsx
│       │   ├── knowledgeBase/
│       │   │   ├── KBList.jsx
│       │   │   ├── KBCard.jsx
│       │   │   └── CreateKBModal.jsx
│       │   └── chat/
│       │       ├── ChatWindow.jsx
│       │       ├── ChatMessage.jsx
│       │       ├── ChatInput.jsx
│       │       └── SourceCitation.jsx
│       │
│       ├── pages/                      # Route-level page components
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── KnowledgeBasePage.jsx
│       │   ├── DocumentsPage.jsx
│       │   └── ChatPage.jsx
│       │
│       ├── hooks/                      # Custom React hooks
│       │   ├── useAuth.js
│       │   ├── useSocket.js
│       │   ├── useDocuments.js
│       │   └── useChat.js
│       │
│       ├── context/                    # React context providers
│       │   ├── AuthContext.jsx
│       │   └── SocketContext.jsx
│       │
│       ├── store/                      # State management
│       │   ├── authSlice.js
│       │   ├── documentSlice.js
│       │   └── chatSlice.js
│       │
│       └── utils/
│           ├── axiosInstance.js        # Axios with interceptors + refresh token
│           ├── formatters.js
│           └── validators.js
│
├── server/                             # Node.js + Express Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── .eslintrc.js
│   └── src/
│       ├── app.js                      # Express app setup (no listen here)
│       ├── server.js                   # HTTP server + Socket.io init + listen
│       │
│       ├── config/
│       │   ├── db.postgres.js          # PostgreSQL connection (pg pool)
│       │   ├── db.mongo.js             # MongoDB connection (mongoose)
│       │   ├── logger.js               # Winston logger instance
│       │   ├── sentry.js               # Sentry init
│       │   └── env.js                  # Validates all env vars on startup
│       │
│       ├── middleware/
│       │   ├── auth.middleware.js      # JWT verify, attach req.user
│       │   ├── role.middleware.js      # requireRole('admin') etc
│       │   ├── validate.middleware.js  # express-validator error handler
│       │   ├── upload.middleware.js    # Multer config (memory storage)
│       │   ├── rateLimiter.middleware.js
│       │   └── error.middleware.js     # Global error handler (last middleware)
│       │
│       ├── routes/
│       │   ├── index.js                # Mounts all routers at /api/v1
│       │   ├── auth.routes.js
│       │   ├── user.routes.js
│       │   ├── knowledgeBase.routes.js
│       │   ├── document.routes.js
│       │   └── chat.routes.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── user.controller.js
│       │   ├── knowledgeBase.controller.js
│       │   ├── document.controller.js
│       │   └── chat.controller.js
│       │
│       ├── services/
│       │   ├── auth.service.js         # login, register, refresh token logic
│       │   ├── user.service.js
│       │   ├── knowledgeBase.service.js
│       │   ├── document.service.js     # GridFS upload, job creation
│       │   ├── chat.service.js         # calls FastAPI, caches, saves history
│       │   ├── ml.service.js           # HTTP client to FastAPI
│       │   └── socket.service.js       # Socket.io event emitters
│       │
│       ├── models/
│       │   ├── mongo/
│       │   │   ├── Document.model.js   # Document chunks metadata
│       │   │   ├── Job.model.js        # Ingestion job queue
│       │   │   └── Chat.model.js       # Conversation history
│       │   └── postgres/
│       │       └── queries.js          # All raw pg queries (no ORM)
│       │
│       ├── validators/
│       │   ├── auth.validator.js
│       │   ├── document.validator.js
│       │   └── chat.validator.js
│       │
│       └── utils/
│           ├── cache.js                # node-cache singleton
│           ├── geminiRetry.js          # Gemini 429 retry logic
│           ├── gridfs.js               # GridFS upload/download helpers
│           └── asyncHandler.js         # Wraps async route handlers
│
└── ml/                                 # FastAPI Python ML Service
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── main.py                     # FastAPI app init, routes mount
        ├── config.py                   # All env vars + settings
        │
        ├── api/
        │   ├── ingest.py               # POST /ml/v1/ingest
        │   ├── query.py                # POST /ml/v1/query
        │   ├── health.py               # GET /ml/v1/health
        │   └── job.py                  # GET /ml/v1/job/{job_id}
        │
        ├── services/
        │   ├── embedder.py             # Sentence Transformers singleton
        │   ├── vectorstore.py          # ChromaDB client + operations
        │   ├── gridfs_reader.py        # Read files from MongoDB GridFS
        │   ├── gemini.py               # Gemini API client + retry logic
        │   └── job_worker.py           # Polls MongoDB jobs, processes them
        │
        ├── pipelines/
        │   ├── ingest_pipeline.py      # LangChain: load → split → embed → store
        │   └── rag_pipeline.py         # LangGraph: query → retrieve → grade → generate
        │
        ├── graph/
        │   ├── rag_graph.py            # LangGraph StateGraph definition
        │   ├── nodes.py                # Each node function (retrieve, grade, generate)
        │   └── state.py                # GraphState TypedDict
        │
        ├── models/
        │   ├── request_models.py       # Pydantic request schemas
        │   └── response_models.py      # Pydantic response schemas
        │
        └── utils/
            ├── logger.py               # Loguru logger
            ├── sentry.py               # Sentry init
            └── mongo.py                # MongoDB connection for job polling
```
