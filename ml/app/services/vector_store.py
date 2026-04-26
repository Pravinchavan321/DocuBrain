import chromadb
from typing import List, Dict, Any
from app.core.logger import logger

class VectorStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStore, cls).__new__(cls)
            logger.info("Initializing ChromaDB PersistentClient at ./chroma_db...")
            cls._instance.client = chromadb.PersistentClient(path="./chroma_db", settings=chromadb.config.Settings(anonymized_telemetry=False))
        return cls._instance

    def get_or_create_collection(self, name: str = "default_collection"):
        try:
            return self.client.get_or_create_collection(name=name)
        except Exception as e:
            logger.error(f"Failed to get or create ChromaDB collection '{name}': {e}")
            raise

    def add_documents(self, collection, ids: List[str], documents: List[str], embeddings: List[List[float]], metadata: List[Dict[str, Any]]):
        try:
            collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings,
                metadatas=metadata
            )
            logger.info(f"Successfully added {len(ids)} document(s) to collection '{collection.name}'.")
        except Exception as e:
            import traceback
            logger.error(f"Error adding documents to collection '{collection.name}': {e}\n{traceback.format_exc()}")
            raise

    def query(self, collection, query_embedding: List[float], n_results: int = 5):
        try:
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            count = len(results['ids'][0]) if results and results.get('ids') and results['ids'] else 0
            logger.info(f"Query executed successfully, found {count} result(s).")
            return results
        except Exception as e:
            logger.error(f"Error querying collection '{collection.name}': {e}")
            raise

# Instantiate the singleton persistent connection
vector_store = VectorStore()
