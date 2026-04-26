import chromadb
from chromadb.config import Settings

client = chromadb.PersistentClient(path="./chroma_db", settings=Settings(anonymized_telemetry=False))
collection = client.get_or_create_collection(name="default_collection")

print(f"Collection count: {collection.count()}")
results = collection.get()
print("All IDs in collection:")
print(results['ids'])


