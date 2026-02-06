from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from datetime import datetime

from app.api.endpoints import movies
from app.api.endpoints import genres

app = FastAPI(
    title="Movie Rating Service",
    description="API для управления фильмами с рейтингом и фильтрацией",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Настройка CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vue/React порты
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(movies.router, prefix="/api")
app.include_router(genres.router, prefix="/api")

@app.get("/")
def home():
    return {
        "message": "Добро пожаловать в Movie Rating Service!",
        "version": "1.0.0",
        "docs": "http://localhost:8000/docs",
        "endpoints": {
            "movies": {
                "get_all": "GET /api/movies",
                "get_one": "GET /api/movies/{id}",
                "create": "POST /api/movies",
                "update": "PUT /api/movies/{id}",
                "delete": "DELETE /api/movies/{id}",
                "stats": "GET /api/movies/stats/count"
            }
        }
    }

@app.get("/health")
def health_check():
    """Проверка здоровья API"""
    return {
        "status": "healthy",
        "service": "Movie Rating API",
        "timestamp": datetime.now().isoformat()
    }

@app.exception_handler(404)
async def not_found(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Ресурс не найден"}
    )
