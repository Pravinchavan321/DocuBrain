import os

class Config:
    APP_NAME: str = "docubrain-ml"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/ml/v1"
    ENVIRONMENT: str = os.environ.get("ENVIRONMENT", "development")

settings = Config()
