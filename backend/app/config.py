from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    """Centralized application settings loaded strictly from environment variables."""
    MONGODB_URL: str = ''
    MONGODB_URI: str = ''
    DB_NAME: str = 'careerai'
    
    JWT_SECRET: str = 'careerai-super-secret-jwt-key-change-in-production'
    JWT_ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    GEMINI_API_KEY: str = ''
    AI_PROVIDER: str = 'gemini'
    
    ADZUNA_APP_ID: str = ''
    ADZUNA_APP_KEY: str = ''
    
    UPLOAD_DIR: str = 'uploads'
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    CORS_ORIGINS: List[str] = ['*']  # Set specific origins via CORS_ORIGINS env var in production

    model_config = SettingsConfigDict(
        env_file='.env', 
        env_file_encoding='utf-8', 
        extra='ignore'
    )

settings = Settings()
