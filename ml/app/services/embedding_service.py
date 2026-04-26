from sentence_transformers import SentenceTransformer
from typing import List
from app.core.logger import logger

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            logger.info("Loading sentence-transformer model (all-MiniLM-L6-v2) - singleton instance...")
            # Defer model loading to method calls to avoid heavy boot time if not needed immediately?
            # Instructions: "Load model once (singleton pattern)"
            cls._instance._model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Sentence Transformer model loaded successfully.")
        return cls._instance

    def encode_text(self, text: str) -> List[float]:
        if not text or not str(text).strip():
            return []
        embedding = self._model.encode(str(text))
        return embedding.tolist()

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embeddings = self._model.encode(texts)
        return embeddings.tolist()

# Instantiate the singleton for global import
embedding_service = EmbeddingService()
