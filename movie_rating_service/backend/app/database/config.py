import os
from dotenv import load_dotenv

load_dotenv()  # Загружаем переменные из .env

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/movie_db")
