import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # ← NUEVO: Para permitir peticiones desde el frontend
from sqlalchemy.orm import Session
from . import database, models

app = FastAPI()

# ← NUEVO: Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambia esto por tu dominio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Permite acceder a las imágenes desde http://localhost:8000/imagenes/nombre_imagen.jpg
app.mount("/imagenes", StaticFiles(directory="Storage Images"), name="storage images")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ← NUEVO: Endpoint GET para obtener TODOS los autos
@app.get("/autos")
def obtener_autos(db: Session = Depends(get_db)):
    """
    Obtiene todos los autos de la base de datos
    """
    try:
        autos = db.query(models.AutoDB).all()
        
        # Construir la URL completa de la imagen
        autos_con_url = []
        for auto in autos:
            autos_con_url.append({
                "id": auto.id,
                "marca": auto.marca,
                "modelo": auto.modelo,
                "anio": auto.anio,
                "precio": auto.precio,
                "disponible": auto.disponible,
                "imagen": auto.imagen,
                "imagen_url": f"http://127.0.0.1:8000/imagenes/{auto.imagen}"  # URL completa
            })
        
        return {
            "total": len(autos_con_url),
            "autos": autos_con_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener autos: {str(e)}")

# ← NUEVO: Endpoint GET para obtener un auto específico por ID
@app.get("/autos/{auto_id}")
def obtener_auto_por_id(auto_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un auto específico por su ID
    """
    auto = db.query(models.AutoDB).filter(models.AutoDB.id == auto_id).first()
    
    if not auto:
        raise HTTPException(status_code=404, detail=f"Auto con ID {auto_id} no encontrado")
    
    return {
        "id": auto.id,
        "marca": auto.marca,
        "modelo": auto.modelo,
        "anio": auto.anio,
        "precio": auto.precio,
        "disponible": auto.disponible,
        "imagen": auto.imagen,
        "imagen_url": f"http://127.0.0.1:8000/imagenes/{auto.imagen}"
    }

# ← NUEVO: Endpoint GET para obtener solo autos disponibles
@app.get("/autos/disponibles/todos")
def obtener_autos_disponibles(db: Session = Depends(get_db)):
    """
    Obtiene solo los autos que están disponibles (disponible = True)
    """
    autos = db.query(models.AutoDB).filter(models.AutoDB.disponible == True).all()
    
    autos_con_url = []
    for auto in autos:
        autos_con_url.append({
            "id": auto.id,
            "marca": auto.marca,
            "modelo": auto.modelo,
            "anio": auto.anio,
            "precio": auto.precio,
            "disponible": auto.disponible,
            "imagen": auto.imagen,
            "imagen_url": f"http://127.0.0.1:8000/imagenes/{auto.imagen}"
        })
    
    return {
        "total": len(autos_con_url),
        "autos": autos_con_url
    }

@app.post("/autos/vincular")
def vincular_auto_con_foto(
    marca: str, 
    modelo: str, 
    anio: int, 
    precio: float, 
    nombre_imagen: str,
    db: Session = Depends(get_db)
):
    """
    Vincula un auto con su imagen
    """
    print(f"📥 Recibido: {marca} {modelo} {anio} ${precio} - Imagen: {nombre_imagen}")
    
    ruta_fisica = os.path.join("Storage Images", nombre_imagen)
    print(f"🔍 Buscando imagen en: {ruta_fisica}")
    
    if not os.path.exists(ruta_fisica):
        print(f"❌ ERROR: No se encontró la imagen en {ruta_fisica}")
        raise HTTPException(status_code=404, detail=f"El archivo '{nombre_imagen}' no existe en la carpeta Storage Images")

    try:
        nuevo_auto = models.AutoDB(
            marca=marca,
            modelo=modelo,
            anio=anio,
            precio=precio,
            imagen=nombre_imagen
        )
        
        db.add(nuevo_auto)
        db.commit()
        db.refresh(nuevo_auto)
        
        print(f"✅ Auto insertado con ID: {nuevo_auto.id}")
        
        return {
            "mensaje": "Auto vinculado con éxito", 
            "auto": {
                "id": nuevo_auto.id,
                "marca": nuevo_auto.marca,
                "modelo": nuevo_auto.modelo,
                "anio": nuevo_auto.anio,
                "precio": nuevo_auto.precio,
                "imagen": nuevo_auto.imagen,
                "imagen_url": f"http://127.0.0.1:8000/imagenes/{nuevo_auto.imagen}"
            }
        }
    except Exception as e:
        print(f"❌ Error al insertar: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar: {str(e)}")