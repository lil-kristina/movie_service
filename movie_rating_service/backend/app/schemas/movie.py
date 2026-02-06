from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

CURRENT_YEAR = datetime.now().year

# Базовые схемы
class MovieBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=10)
    genres: List[str] = Field(default_factory=list)
    release_year: int = Field(..., ge=1900, le=CURRENT_YEAR)
    poster_url: Optional[str] = None

# Для создания фильма
class MovieCreate(MovieBase):
    pass

# Для обновления фильма
class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=10)
    genres: Optional[List[str]] = None
    release_year: Optional[int] = Field(None, ge=1900, le=CURRENT_YEAR)
    poster_url: Optional[str] = None

# Для ответа API
class MovieResponse(MovieBase):
    id: int
    created_at: datetime
    poster_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)  # Для работы с SQLAlchemy