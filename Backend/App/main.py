import os
import urllib.parse
from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import database, models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/imagenes", StaticFiles(directory="Storage Images"), name="storage images")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def obtener_imagen_vehiculo(vehiculo):
    import os
    import urllib.parse
    
    # La carpeta compartida de imágenes (relativa a Backend/app/main.py)
    ruta_base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "Storage Images")
    
    # Formato Base que queremos encontrar (ej. "2023 Lexus LX 600 F Sport")
    nombre_buscado = f"{vehiculo.anio}{vehiculo.marca}{vehiculo.modelo}".replace(" ", "").lower()
    
    try:
        if os.path.exists(ruta_base):
            archivos = os.listdir(ruta_base)
            for archivo in archivos:
                # Comparamos ignorando espacios y mayúsculas
                if nombre_buscado in archivo.replace(" ", "").lower():
                    # ¡Encontramos el archivo EXACTO físico que existe!
                    return f"http://127.0.0.1:8000/imagenes/{urllib.parse.quote(archivo)}"
    except Exception as e:
        print(f"Error buscando la imagen: {e}")
        
    # Si no lo encuentra, devuelve un nombre genérico esperado
    nombre_fallback = f"{vehiculo.anio} {vehiculo.marca} {vehiculo.modelo}.jpg"
    return f"http://127.0.0.1:8000/imagenes/{urllib.parse.quote(nombre_fallback)}"

# ✅ ENDPOINT GET para obtener TODOS los vehículos
@app.get("/autos")
def obtener_autos(db: Session = Depends(get_db)):
    """
    Obtiene todos los vehículos de la base de datos
    """
    try:
        # ✅ CAMBIÓ DE models.AutoDB a models.VehiculoDB
        vehiculos = db.query(models.VehiculoDB).all()
        
        autos_con_url = []
        for vehiculo in vehiculos:
            autos_con_url.append({
                "id": vehiculo.id,
                "marca": vehiculo.marca,
                "modelo": vehiculo.modelo,
                "anio": vehiculo.anio,
                "color": vehiculo.color,
                "precio": vehiculo.precio,
                "kilometraje": vehiculo.kilometraje,
                "transmision": vehiculo.transmision,
                "combustible": vehiculo.combustible,
                "tipo_vehiculo": vehiculo.tipo_vehiculo,
                "disponible": vehiculo.disponible,
                "destacado": vehiculo.destacado,
                "descripcion": vehiculo.descripcion,
                "imagen": vehiculo.imagen,
                "imagen_url": obtener_imagen_vehiculo(vehiculo)
            })
        
        return {
            "total": len(autos_con_url),
            "autos": autos_con_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener autos: {str(e)}")

# ✅ ENDPOINT GET para obtener un vehículo específico por ID
@app.get("/autos/{auto_id}")
def obtener_auto_por_id(auto_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un vehículo específico por su ID
    """
    # ✅ CAMBIÓ DE models.AutoDB a models.VehiculoDB
    vehiculo = db.query(models.VehiculoDB).filter(models.VehiculoDB.id == auto_id).first()
    
    if not vehiculo:
        raise HTTPException(status_code=404, detail=f"Auto con ID {auto_id} no encontrado")
    
    return {
        "id": vehiculo.id,
        "marca": vehiculo.marca,
        "modelo": vehiculo.modelo,
        "anio": vehiculo.anio,
        "color": vehiculo.color,
        "precio": vehiculo.precio,
        "kilometraje": vehiculo.kilometraje,
        "transmision": vehiculo.transmision,
        "combustible": vehiculo.combustible,
        "tipo_vehiculo": vehiculo.tipo_vehiculo,
        "disponible": vehiculo.disponible,
        "destacado": vehiculo.destacado,
        "descripcion": vehiculo.descripcion,
        "imagen": vehiculo.imagen,
        "imagen_url": obtener_imagen_vehiculo(vehiculo)
    }

# ✅ ENDPOINT GET para obtener solo vehículos disponibles
@app.get("/autos/disponibles/todos")
def obtener_autos_disponibles(db: Session = Depends(get_db)):
    """
    Obtiene solo los vehículos que están disponibles
    """
    # ✅ CAMBIÓ de models.AutoDB a models.VehiculoDB
    vehiculos = db.query(models.VehiculoDB).filter(models.VehiculoDB.disponible == True).all()
    
    autos_con_url = []
    for vehiculo in vehiculos:
        autos_con_url.append({
            "id": vehiculo.id,
            "marca": vehiculo.marca,
            "modelo": vehiculo.modelo,
            "anio": vehiculo.anio,
            "precio": vehiculo.precio,
            "disponible": vehiculo.disponible,
            "imagen": vehiculo.imagen,
            "imagen_url": obtener_imagen_vehiculo(vehiculo)
        })
    
    return {
        "total": len(autos_con_url),
        "autos": autos_con_url
    }

# ✅ ENDPOINT POST para vincular vehículo con foto
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
    Vincula un vehículo con su imagen
    """
    print(f"📥 Recibido: {marca} {modelo} {anio} ${precio} - Imagen: {nombre_imagen}")
    
    ruta_fisica = os.path.join("Storage Images", nombre_imagen)
    print(f"🔍 Buscando imagen en: {ruta_fisica}")
    
    if not os.path.exists(ruta_fisica):
        print(f"❌ ERROR: No se encontró la imagen en {ruta_fisica}")
        raise HTTPException(status_code=404, detail=f"El archivo '{nombre_imagen}' no existe en la carpeta Storage Images")

    try:
        # ✅ CAMBIÓ de models.AutoDB a models.VehiculoDB
        nuevo_vehiculo = models.VehiculoDB(
            marca=marca,
            modelo=modelo,
            anio=anio,
            precio=precio,
            imagen=nombre_imagen
        )
        
        db.add(nuevo_vehiculo)
        db.commit()
        db.refresh(nuevo_vehiculo)
        
        print(f"✅ Vehículo insertado con ID: {nuevo_vehiculo.id}")
        
        return {
            "mensaje": "Auto vinculado con éxito", 
            "auto": {
                "id": nuevo_vehiculo.id,
                "marca": nuevo_vehiculo.marca,
                "modelo": nuevo_vehiculo.modelo,
                "anio": nuevo_vehiculo.anio,
                "precio": nuevo_vehiculo.precio,
                "imagen": nuevo_vehiculo.imagen,
                "imagen_url": f"http://127.0.0.1:8000/imagenes/{nuevo_vehiculo.imagen}"
            }
        }
    except Exception as e:
        print(f"❌ Error al insertar: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar: {str(e)}")