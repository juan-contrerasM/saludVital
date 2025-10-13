# db/coneccion.py
from dotenv import load_dotenv
import os
import psycopg2

def conectar_db():
    # Cargar variables de entorno si existe .env
    if os.path.exists(".env"):
        load_dotenv()

    url = os.getenv("DATABASE_URL")
    if not url:
        raise ValueError("La variable de entorno DATABASE_URL no está definida.")

    # Conectar a la base de datos
    conn = psycopg2.connect(url, sslmode="require")
    return conn
