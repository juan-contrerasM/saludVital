import supabase
from supabase import create_client, Client
from db.coneccion import conectar_db
import uuid
from dotenv import load_dotenv
from sqlalchemy import text
import os


#Metodo para agendar cita
def agendar_cita(paciente_id: str, fecha: str, hora: str, motivo: str):
    conn = conectar_db()
    cur = conn.cursor()

    id_cita = str(uuid.uuid4())  # Generar un ID único

    cur.execute("""
        INSERT INTO citas (id, paciente_id, fecha, hora, motivo)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, paciente_id, fecha, hora, motivo;
    """, (id_cita, paciente_id, fecha, hora, motivo))

    nueva_cita = cur.fetchone()
    conn.commit()

    print("✅ Cita agendada:", nueva_cita)

    cur.close()
    conn.close()

    return nueva_cita
    
#Consulta de resultados médicos
def obtener_resultados_medicos(paciente_id):
    try:
        conn = conectar_db()
        cur = conn.cursor()

        query = """
            SELECT id, tipo_examen, resultado, fecha
            FROM resultados
            WHERE paciente_id = %s
            ORDER BY fecha DESC
        """
        cur.execute(query, (paciente_id,))
        resultados = cur.fetchall()

        cur.close()
        conn.close()

        # Formatear los resultados
        resultados_lista = [
            {
                "id": str(row[0]),
                "tipo_examen": row[1],
                "resultado": row[2],
                "fecha": str(row[3])
            }
            for row in resultados
        ]

        return resultados_lista

    except Exception as e:
        print(f"❌ Error al consultar resultados: {e}")
        return []


# Obtener datos del paciente
def obtener_datos_paciente(paciente_id):
    """
    Retorna el nombre y correo del paciente dado su ID.
    """
    try:
        conn = conectar_db()
        cur = conn.cursor()

        query = """
            SELECT nombre, correo 
            FROM pacientes
            WHERE id = %s;
        """
        cur.execute(query, (paciente_id,))
        result = cur.fetchone()

        if result:
            nombre, correo = result
            return {"nombre": nombre, "correo": correo}
        else:
            return None

    except Exception as e:
        print(f"❌ Error al obtener datos del paciente: {e}")
        return None

    finally:
        cur.close()
        conn.close()

#Obtener ID del paciente a partir del correo
def obtener_id_correo(correo: str):
    """
    Retorna el ID del paciente dado su correo.
    """
    try:
        conn = conectar_db()
        cur = conn.cursor()

        query = """
            SELECT id 
            FROM pacientes
            WHERE correo = %s;
        """
        cur.execute(query, (correo,))
        result = cur.fetchone()

        if result:
            return str(result[0])
        else:
            return None

    except Exception as e:
        print(f"❌ Error al obtener ID por correo: {e}")
        return None

    finally:
        cur.close()
        conn.close()