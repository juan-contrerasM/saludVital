from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from modelo.citas_model import generar_reporte_citas, consultar_resultados_medicos

router = APIRouter(prefix="/citas", tags=["citas"])

# ============================
# 📘 MODELO DE ENTRADA (Pydantic)
# ============================
class CitaRequest(BaseModel):
    correo: str
    fecha: str
    hora: str
    motivo: str


# ============================
# 🩺 ENDPOINT: Agendar Cita
# ============================
@router.post("/agendar")
async def agendar_cita_endpoint(cita: CitaRequest):
    """
    Valida los datos y agenda una nueva cita médica.
    """
    try:
        resultado = generar_reporte_citas(
            cita.correo,
            cita.fecha,
            cita.hora,
            cita.motivo
        )
        return resultado
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/resultados/{correo}")
def get_resultados_medicos(correo: str):
    """
    Endpoint para consultar los resultados médicos de un paciente.
    """
    return consultar_resultados_medicos(correo)