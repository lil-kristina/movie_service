from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from app.models.movie import Movie
from app.schemas.movie import MovieCreate, MovieUpdate

def get_movie(db: Session, movie_id: int) -> Optional[Movie]:
    """Получить фильм по ID"""
    return db.query(Movie).filter(Movie.id == movie_id).first()

def get_movies(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    genres: Optional[List[str]] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None
) -> List[Movie]:
    """Получить список фильмов с фильтрацией"""
    query = db.query(Movie)
    
    if genres:
        query = query.filter(Movie.genres.op('&&')(genres))
    
    # Фильтрация по рейтингу
    if min_rating is not None:
        query = query.filter(Movie.rating >= min_rating)
    if max_rating is not None:
        query = query.filter(Movie.rating <= max_rating)
    
    return query.order_by(Movie.id).offset(skip).limit(limit).all()

def create_movie(db: Session, movie: MovieCreate) -> Movie:
    """Создать новый фильм"""
    db_movie = Movie(
        title=movie.title,
        description=movie.description,
        rating=movie.rating,
        genres=movie.genres,
        release_year=movie.release_year,
        poster_url=movie.poster_url
        
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def update_movie(db: Session, movie_id: int, movie_update: MovieUpdate) -> Optional[Movie]:
    """Обновить фильм"""
    db_movie = get_movie(db, movie_id)
    if not db_movie:
        return None
    
    update_data = movie_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_movie, field, value)
    
    db.commit()
    db.refresh(db_movie)
    return db_movie

def delete_movie(db: Session, movie_id: int) -> bool:
    """Удалить фильм"""
    db_movie = get_movie(db, movie_id)
    if not db_movie:
        return False
    
    db.delete(db_movie)
    db.commit()
    return True

def get_movies_count(db: Session) -> int:
    """Получить общее количество фильмов"""
    return db.query(Movie).count()