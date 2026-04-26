# DocuBrain — Database Schema
> ALWAYS paste this file at the start of every AI coding session.
> Use EXACT field names. Never invent new fields.

---

## PostgreSQL Tables (Supabase)

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' | 'user'
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### sessions (refresh tokens)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(512) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### knowledge_bases
```sql
CREATE TABLE knowledge_bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  original_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(20) NOT NULL,       -- 'pdf' | 'docx' | 'txt'
  file_size_bytes BIGINT NOT NULL,
  gridfs_file_id VARCHAR(255) NOT NULL, -- MongoDB GridFS ObjectId as string
  status VARCHAR(20) DEFAULT 'pending', -- 'pending'|'processing'|'done'|'failed'
  chunk_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,         -- 'upload'|'query'|'delete'|'login'
  resource_type VARCHAR(50),            -- 'document'|'knowledge_base'|'chat'
  resource_id VARCHAR(255),
  metadata JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## MongoDB Collections

### jobs (ingestion queue)
```js
{
  _id: ObjectId,
  document_id: String,          // PostgreSQL documents.id (UUID string)
  knowledge_base_id: String,    // PostgreSQL knowledge_bases.id
  gridfs_file_id: String,       // MongoDB GridFS file ObjectId
  file_type: String,            // 'pdf' | 'docx' | 'txt'
  status: String,               // 'pending' | 'processing' | 'done' | 'failed'
  error: String | null,
  created_at: Date,
  updated_at: Date,
  started_at: Date | null,
  completed_at: Date | null
}
// Index: status (for job polling)
```

### chunks (document chunks after ingestion)
```js
{
  _id: ObjectId,
  document_id: String,          // PostgreSQL documents.id
  knowledge_base_id: String,    // PostgreSQL knowledge_bases.id
  chroma_id: String,            // ChromaDB vector ID
  content: String,              // Raw text of chunk
  chunk_index: Number,          // Position in document
  page_number: Number | null,
  metadata: {
    source: String,             // original filename
    file_type: String,
    total_chunks: Number
  },
  created_at: Date
}
// Index: document_id, knowledge_base_id
```

### chats (conversation history)
```js
{
  _id: ObjectId,
  user_id: String,              // PostgreSQL users.id
  knowledge_base_id: String,    // PostgreSQL knowledge_bases.id
  session_id: String,           // UUID generated per chat session
  messages: [
    {
      role: String,             // 'user' | 'assistant'
      content: String,
      sources: [                // Only on assistant messages
        {
          document_id: String,
          original_name: String,
          chunk_index: Number,
          page_number: Number | null,
          relevance_score: Number
        }
      ],
      created_at: Date
    }
  ],
  created_at: Date,
  updated_at: Date
}
// Index: user_id, knowledge_base_id, session_id
```

---

## ChromaDB Collections

### collection name: `kb_{knowledge_base_id}`
One ChromaDB collection per knowledge base.

```
Documents stored with:
  id: String               → MongoDB chunk._id as string
  embedding: float[]       → 384-dim vector from Sentence Transformers
  metadata: {
    document_id: String,
    knowledge_base_id: String,
    chunk_index: Number,
    page_number: Number,
    source: String
  }
  document: String         → chunk content text
```

---

## MongoDB GridFS
Files stored in default GridFS buckets: `fs.files` + `fs.chunks`

```
fs.files document:
  _id: ObjectId            → this is gridfs_file_id stored in PostgreSQL
  filename: String         → original file name
  contentType: String      → 'application/pdf' etc
  length: Number           → file size in bytes
  metadata: {
    uploaded_by: String,   → user_id
    knowledge_base_id: String,
    document_id: String
  }
```
