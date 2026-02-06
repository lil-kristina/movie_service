from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.schemas.movie import MovieCreate, MovieUpdate, MovieResponse
from app.crud import movies as crud

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/", response_model=List[MovieResponse])
def read_movies(
    skip: int = 0,
    limit: int = 100,
    genres: Optional[List[str]] = Query(None, description="Фильтр по жанрам"),
    min_rating: Optional[float] = Query(None, ge=0, le=10, description="Минимальный рейтинг"),
    max_rating: Optional[float] = Query(None, ge=0, le=10, description="Максимальный рейтинг"),
    db: Session = Depends(get_db)
):
    """
    Получить список фильмов.
    
    - **skip**: сколько записей пропустить (для пагинации)
    - **limit**: максимальное количество записей
    - **genres**: фильтр по жанрам (можно несколько)
    - **min_rating**: минимальный рейтинг
    - **max_rating**: максимальный рейтинг
    """
    return crud.get_movies(
        db, 
        skip=skip, 
        limit=limit,
        genres=genres,
        min_rating=min_rating,
        max_rating=max_rating
    )

@router.get("/{movie_id}", response_model=MovieResponse)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Получить фильм по ID.
    """
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Фильм не найден")
    return db_movie

@router.post("/", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def create_movie(movie: MovieCreate, db: Session = Depends(get_db)):
    """
    Создать новый фильм.
    """
    return crud.create_movie(db=db, movie=movie)

@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie(
    movie_id: int, 
    movie_update: MovieUpdate, 
    db: Session = Depends(get_db)
):
    """
    Обновить фильм.
    """
    db_movie = crud.update_movie(db, movie_id=movie_id, movie_update=movie_update)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Фильм не найден")
    return db_movie

@router.delete("/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Удалить фильм.
    """
    success = crud.delete_movie(db, movie_id=movie_id)
    if not success:
        raise HTTPException(status_code=404, detail="Фильм не найден")
    return {"message": "Фильм успешно удален"}

@router.get("/stats/count")
def get_movies_count(db: Session = Depends(get_db)):
    """
    Получить статистику по фильмам.
    """
    count = crud.get_movies_count(db)
    return {"total_movies": count}