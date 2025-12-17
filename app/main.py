# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import languages, themes, auth, tasks
from app.core.config import settings
from app.database import engine, Base

# Создаём таблицы при запуске приложения (временно)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://krystin-unfrightening-nash.ngrok-free.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(languages.router, prefix=settings.API_PREFIX)
app.include_router(themes.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(languages.router, prefix=settings.API_PREFIX)
app.include_router(themes.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(tasks.router, prefix=settings.API_PREFIX)

@app.get("/")
def read_root():
    return {"message": "Welcome to РЕШАЛКА API!"}