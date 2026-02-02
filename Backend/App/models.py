from pydantic import BaseModel
from typing import Optional

class Auto(BaseModel):
    id : Optional[int] = None
    marca : str
    modelo : str
    anio : int
    precio : float
    disponible : bool = True
    