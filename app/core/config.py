from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "РЕШАЛКА"
    PROJECT_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_NAME: str = "reshalka.db"

    class Config:
        env_file = ".env"


settings = Settings()

