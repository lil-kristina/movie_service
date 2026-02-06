from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.dialects.postgresql import ARRAY  
from sqlalchemy.sql import func
from app.database.session import Base  

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    rating = Column(Float)
    genres = Column(ARRAY(Text), default=list)  
    release_year = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    poster_url = Column(String(500), nullable=True)
    
    def __repr__(self):
        return f"<Movie(id={self.id}, title='{self.title}', rating={self.rating})>"