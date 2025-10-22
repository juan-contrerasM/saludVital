from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from servicio import citas_servicio

app = FastAPI()

# Orígenes permitidos
origins = [
    "http://localhost:3000",          # frontend local dev
    "http://127.0.0.1:3000",          # frontend local dev
    "http://18.222.102.240:5173",     # frontend en EC2
    "https://saludvital.vercel.app",
    "http://18.222.102.240:8080", # dominio futuro
]

# CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# incluir las rutas
app.include_router(citas_servicio.router)
