import chromadb
from chromadb.config import Settings
import os
import shutil

def clear_chroma():
    db_path = "./chroma_db"
    
    print(f"Connecting to ChromaDB at {db_path}...")
    try:
        client = chromadb.PersistentClient(path=db_path, settings=Settings(anonymized_telemetry=False))
        
        # Get all collections
        collections = client.list_collections()
        if not collections:
            print("No collections found.")
        else:
            for col in collections:
                col_name = col.name if hasattr(col, 'name') else str(col)
                print(f"Deleting collection: {col_name}")
                client.delete_collection(name=col_name)
        
        print("Vector store API-level clear complete.")
    except Exception as e:
        print(f"Error during API clear: {e}")
        print("Attempting filesystem-level clear...")

    # For absolute certainty, clear the directory if it exists
    if os.path.exists(db_path):
        try:
            # We don't delete the directory itself as it might be a mount point, 
            # just clear its contents.
            for filename in os.listdir(db_path):
                file_path = os.path.join(db_path, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f'Failed to delete {file_path}. Reason: {e}')
            print(f"Filesystem-level clear of {db_path} complete.")
        except Exception as e:
            print(f"Error during filesystem clear: {e}")

if __name__ == "__main__":
    clear_chroma()
