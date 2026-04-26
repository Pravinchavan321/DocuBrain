# DocuBrain — Full Project Structure & Context
> Paste this entire file into any AI coding agent to provide full context of the project.

## 🚀 Project Overview
DocuBrain is an enterprise RAG (Retrieval Augmented Generation) knowledge base that allows users to upload documents and query them using AI.

## 🛠️ Tech Stack & Ports
| Service | Technology | Port |
|---|---|---|
| **Frontend** | React.js (Vite) + Socket.io | 5173 |
| **Backend** | Node.js + Express + Socket.io | 5000 |
| **ML Service** | FastAPI (Python) | 8000 |
| **Primary DB** | MongoDB (Auth, Files, Jobs) | 27017 |
| **Vector DB** | ChromaDB | 8000 (Internal) |
| **AI Model** | Gemini API | - |

---

## 📂 File Structure (Filtered)

### 📁 Root
- `ARCHITECTURE.md` - Core architecture reference
- `PROJECT_OVERVIEW.md` - High-level summary
- `docker-compose.yml` - Container orchestration
- `.env` - Environment variables

### 📁 Client (Frontend) - `/client`
- `src/`
  - `components/`
    - `common/`
      - `Button.jsx` - **[NEW]** High-fidelity neon button with bubble hover
      - `InputField.jsx` - **[NEW]** Sharp neon-focus input
    - `layout/`
      - `AuthLayout.jsx` - **[NEW]** Ultimate 3D Glassmorphism layout with magnetic lights & organic brain icon
    - `auth/` (Auth logic components)
    - `dashboard/`
  - `pages/`
    - `LoginPage.jsx` - **[NEW]** Professional 3D Login
    - `RegisterPage.jsx` - **[NEW]** Professional 3D Sign-up
    - `Dashboard.jsx`
  - `context/`
    - `AuthContext.jsx` - Global authentication state
  - `utils/`
    - `api.js` - Axios instance
    - `error.js` - Error normalization
  - `App.jsx` - Main routes
  - `index.css` - Global styles (Tailwind)
- `public/`
  - `assets/`
    - `bg-3d.png` - AI Brain background image
    - `bg-signup.png` - Neural growth background image

### 📁 Server (Backend) - `/server`
- `src/`
  - `controllers/`
    - `authController.js` - Login/Register logic
    - `docController.js` - File upload logic
  - `models/`
    - `User.js` - Mongoose User schema
    - `Document.js` - Mongoose Document schema
  - `routes/`
    - `authRoutes.js`
    - `docRoutes.js`
  - `middleware/`
    - `auth.js` - JWT verification
  - `services/`
    - `mlService.js` - Communication with FastAPI
  - `index.js` - Entry point (Express + Socket.io)
- `.env` - Backend environment variables

### 📁 ML Service (AI) - `/ml`
- `app/`
  - `api/v1/routes/`
    - `embedding.py` - Vector generation
    - `query.py` - RAG pipeline logic
  - `services/`
    - `embedding_service.py` - LangChain integrations
    - `vector_store.py` - ChromaDB interactions
  - `core/`
    - `config.py` - Pydantic settings
  - `main.py` - FastAPI entry point
- `chroma_db/` - Persistent vector storage
- `requirements.txt` - Python dependencies

---

## 🔐 Auth Page Design Specs (Current)
The Sign-in and Sign-up pages use a **World-Class 3D Glassmorphism & Neon** design:
- **Background**: 3D imagery with drifting uppercase quotes (e.g., "SECURE ACCESS").
- **Card**: Transparent glass with a **8px blur**, **3D Magnetic Border Glow** (follows mouse), and **"Come Forward"** scale effect on hover.
- **Icon**: Custom Organic Brain SVG with a pulsing AI core.
- **Typography**: High-contrast all-caps high-tech labels for maximum readability.

## 🔄 Core Data Flow
1. **Upload**: User → Express → GridFS → Job Created.
2. **Process**: FastAPI (Polls Job) → LangChain Chunks → Sentence Transformers → ChromaDB.
3. **Query**: User → Express → FastAPI (RAG) → ChromaDB Search → Gemini Prompt → Answer.
