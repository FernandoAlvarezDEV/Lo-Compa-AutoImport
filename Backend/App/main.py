from fastapi import FastAPI
from models import Auto

app = FastAPI(title="Backend")

db_autos = []

@app.get("/")

def inicio():
    return {"Bienvenido al Sistema del Concesionario"}


@app.get("/Autos")
def ObtenerAutos():
        return db_autos

@app.post("/Autos")
def RegistrarAutos(auto : Auto):
    nuevo_auto = auto.dict()
    nuevo_auto["id"] = len(db_autos) + 1 
    db_autos.append(nuevo_auto)
    return{"Auto Registrado con Exito," "Auto": nuevo_auto}
