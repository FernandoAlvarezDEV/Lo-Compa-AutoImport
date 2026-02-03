from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

URL_DATABASE = "mysql+mysqlconnector://root:Carlos591002*@localhost:3306/Backend"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit= False, autoflush= True, bind=engine)

Base = declarative_base()

