from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
import time
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.core.logger import logger

router = APIRouter()

class EmbedRequest(BaseModel):
    text: str

class StoreRequest(BaseModel):
    id: str
    text: str
    metadata: Optional[Dict[str, Any]] = {}

class QueryRequest(BaseModel):
    query: str

@router.post("/embed")
async def embed_text(req: EmbedRequest):
    try:
        if not req.text.strip():
            raise ValueError("Text cannot be empty")
        
        start_time = time.time()
        embedding = await asyncio.wait_for(
            asyncio.to_thread(embedding_service.encode_text, req.text),
            timeout=25.0
        )
        latency = (time.time() - start_time) * 1000
        logger.info(f"Embedding generated in {latency:.2f}ms for text length {len(req.text)}")

        return {
            "success": True,
            "data": {
                "embedding": embedding
            },
            "message": "Embedding generated"
        }
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Failed to generate embedding",
                "error": str(e)
            }
        )

@router.post("/store")
async def store_document(req: StoreRequest):
    try:
        if not req.text.strip() or not req.id.strip():
            raise ValueError("ID and text cannot be empty")

        # Generate embedding
        embedding = embedding_service.encode_text(req.text)
        
        # Get DB Collection
        collection = vector_store.get_or_create_collection("default_collection")
        
        # Store in ChromaDB
        vector_store.add_documents(
            collection=collection,
            ids=[req.id],
            documents=[req.text],
            embeddings=[embedding],
            metadata=[req.metadata]
        )
        
        return {
            "success": True,
            "data": {},
            "message": f"Document {req.id} stored successfully"
        }
    except Exception as e:
        logger.error(f"Error storing document: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Failed to store document",
                "error": str(e)
            }
        )

@router.post("/query")
async def query_documents(req: QueryRequest):
    try:
        if not req.query.strip():
            raise ValueError("Query cannot be empty")

        # Embed query text
        query_embedding = embedding_service.encode_text(req.query)
        
        # Pull collection
        collection = vector_store.get_or_create_collection("default_collection")
        
        # Query ChromaDB
        results = vector_store.query(
            collection=collection,
            query_embedding=query_embedding,
            n_results=5
        )
        
        return {
            "success": True,
            "data": {
                "results": results
            },
            "message": "Query successful"
        }
    except Exception as e:
        logger.error(f"Error querying documents: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Failed to query documents",
                "error": str(e)
            }
        )
