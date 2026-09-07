import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", 5000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    ENV: str = os.getenv("ENV", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/meditrack")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "meditrack_python_super_secret_jwt_key_2026_production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRES_IN_MINUTES: int = int(os.getenv("JWT_EXPIRES_IN_MINUTES", 1440))
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

settings = Settings()
