from dotenv import load_dotenv
import os
import psycopg2

if os.path.exists(".env"):
    load_dotenv()  # solo carga .env si existe

url = os.getenv("DATABASE_URL")
if not url:
    raise ValueError("La variable de entorno DATABASE_URL no está definida.")

conn = psycopg2.connect(url, sslmode="require")
