from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.database.config import DATABASE_URL

# Создаем движок для подключения к PostgreSQL
engine = create_engine(DATABASE_URL)

# Создаем фабрику сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Создаем базовый класс для моделей
Base = declarative_base()

def get_db():
    """Зависимость для получения сессии БД"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()