from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Master"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "resume_teacher"
    SECRET_KEY: str = "b68b75cbed1d033c4ebdb08d02c52cb07dc45b17a1f2b60abfdbdc8a6fcf7c2b"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"

    class Config:
        env_file = ".env"

settings = Settings()
