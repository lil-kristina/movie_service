from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from typing import List

from app.database.session import get_db
from app.models.movie import Movie

router = APIRouter(prefix="/genres", tags=["genres"])

@router.get("/")
def get_all_genres(db: Session = Depends(get_db)):

    # Получаем все уникальные жанры из всех фильмов
    result = db.query(Movie.genres).all()
    
    # Собираем все жанры в один список
    all_genres = set()
    for row in result:
        if row.genres:  
            all_genres.update(row.genres)
    
    return {
        "count": len(all_genres),
        "genres": sorted(list(all_genres))
    }

@router.get("/stats")
def get_genres_stats(db: Session = Depends(get_db)):
    """
    Статистика по жанрам: сколько фильмов в каждом жанре.
    """
    # Это более сложный запрос - можно добавить позже
    return {"message": "В разработке"}