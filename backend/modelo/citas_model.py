from datetime import datetime
from db.citas_query import agendar_cita, obtener_resultados_medicos, obtener_datos_paciente
from utils.correo import enviar_correo_agendamiento

import re
from datetime import datetime

def validar_datos_cita(paciente_id: str, fecha: str, hora: str, motivo: str):
    errores = []

    # Validar paciente_id
    if not paciente_id or not isinstance(paciente_id, str):
        errores.append("El ID del paciente es obligatorio y debe ser un texto válido.")

    # Validar motivo
    if not motivo or len(motivo.strip()) < 3:
        errores.append("El motivo de la cita debe tener al menos 3 caracteres.")

    # Validar formato de fecha
    try:
        datetime.strptime(fecha, "%Y-%m-%d")
    except ValueError:
        errores.append("La fecha debe tener formato YYYY-MM-DD y ser válida.")

    # Validar formato de hora exacto
    if not re.match(r"^\d{2}:\d{2}:\d{2}$", hora):
        errores.append("La hora debe tener exactamente formato HH:MM:SS (por ejemplo, 14:30:00).")
    else:
        try:
            datetime.strptime(hora, "%H:%M:%S")
        except ValueError:
            errores.append("La hora proporcionada no es válida.")

    if errores:
        return False, errores
    return True, None



def generar_reporte_citas(paciente_id: str, fecha: str, hora: str, motivo: str):
    valido, errores = validar_datos_cita(paciente_id, fecha, hora, motivo)

    if valido:
        agendar_cita(paciente_id, fecha, hora, motivo)
        #  Aquí se invoca la función que envía el correo
        datos = obtener_datos_paciente(paciente_id)
        enviar_correo_agendamiento(datos["correo"], datos["nombre"], fecha,hora, motivo)

        return {"Exitoso": "✅ Cita generada correctamente"}
    else:
        return {"Error": errores}

def validar_paciente_id(paciente_id: str):
    if not paciente_id or not isinstance(paciente_id, str) or len(paciente_id.strip()) < 2:
        return False, "El ID del paciente es obligatorio y debe ser texto válido."
    return True, None

def consultar_resultados_medicos(paciente_id: str):
    """
    Valida el ID y consulta los resultados del paciente.
    """
    valido, error = validar_paciente_id(paciente_id)
    if not valido:
        return {"status": "error", "mensaje": error}

    resultados = obtener_resultados_medicos(paciente_id)
    if not resultados:
        return {"status": "ok", "mensaje": "No se encontraron resultados médicos para este paciente."}

    return {"status": "ok", "resultados": resultados}