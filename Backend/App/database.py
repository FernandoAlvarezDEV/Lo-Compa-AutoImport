from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Carga las variables del archivo .env (ruta explícita al .env dentro de app/)
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

# Asigna las variables a constantes
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

URL_DATABASE = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{os.getenv('DB_PORT')}/{DB_NAME}"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit= False, autoflush= True, bind=engine)

Base = declarative_base()

