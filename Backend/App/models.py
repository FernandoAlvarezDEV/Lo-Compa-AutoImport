from sqlalchemy import Column, Integer, String, Float, Boolean
from .database import Base  # ← Import relativo

class AutoDB(Base):
    __tablename__ = "Autos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50))
    modelo = Column(String(50))
    anio = Column(Integer)
    precio = Column(Float)
    disponible = Column(Boolean, default=True)
    imagen = Column(String(255))