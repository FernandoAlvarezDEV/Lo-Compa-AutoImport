from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from .database import Base

class VehiculoDB(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False, index=True)
    modelo = Column(String(50), nullable=False)
    anio = Column(Integer, nullable=False)
    color = Column(String(30))
    precio = Column(Float, nullable=False, index=True)
    kilometraje = Column(Integer, default=0)
    transmision = Column(Enum('Manual', 'Automatica', 'CVT'), default='Automatica')
    combustible = Column(Enum('Gasolina', 'Diesel', 'Hibrido', 'Electrico'), default='Gasolina')
    tipo_vehiculo = Column(Enum('Sedan', 'SUV', 'Camioneta', 'Deportivo', 'Convertible', 'Hatchback'))
    vin = Column(String(17), unique=True)
    placa = Column(String(20), unique=True)
    disponible = Column(Boolean, default=True, index=True)
    destacado = Column(Boolean, default=False, index=True)
    descripcion = Column(Text)
    imagen = Column(String(255))
    fecha_ingreso = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())