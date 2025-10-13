from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from servicio import citas_servicio

app = FastAPI()

# Orígenes permitidos
origins = [
    "http://localhost:3000",  # frontend dev
    "http://127.0.0.1:3000" # otro posible host local
    # puedes poner "*" en desarrollo, pero no en producción
]

# CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://3.17.207.163:5173",  # Frontend en EC2
        "https://saludvital.vercel.app",  # Ejemplo dominio futuro
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# incluir las rutas
app.include_router(citas_servicio.router)
