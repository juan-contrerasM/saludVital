import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Cargar variables del .env
load_dotenv()

EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def enviar_correo_agendamiento(destinatario, nombre_paciente, fecha, hora, motivo):
    """
    Envía un correo de confirmación de agendamiento al paciente.
    """
    try:
        # Configurar mensaje
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_SENDER
        mensaje["To"] = destinatario
        mensaje["Subject"] = "Confirmación de tu cita médica - VitalApp"

        cuerpo = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Hola {nombre_paciente},</h2>
            <p>Tu cita ha sido <b>agendada exitosamente</b> en <b>VitalApp</b>.</p>
            <p><b>Detalles de la cita:</b></p>
            <ul>
                <li><b>Fecha:</b> {fecha}</li>
                <li><b>Hora:</b> {hora}</li>
                <li><b>Motivo:</b> {motivo}</li>
            </ul>
            <p>Por favor, llega 10 minutos antes de tu cita.</p>
            <p style="color: #888;">Este es un correo automático, no respondas a este mensaje.</p>
        </body>
        </html>
        """
        mensaje.attach(MIMEText(cuerpo, "html"))

        # Enviar correo (usando Gmail)
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(mensaje)

        print(f"✅ Correo enviado exitosamente a {destinatario}")
        return True

    except Exception as e:
        print(f"❌ Error al enviar correo: {e}")
        return False
