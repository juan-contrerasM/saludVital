import React, { useState } from "react";
import AgendarCita from "./components/AgendarCitas";
import ConsultarCitas from "./components/ConsultarCitas";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

function App() {
  const [email, setEmail] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarCitas = async () => {
    if (!email) return alert("Ingresa un correo");
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/citas/resultados/${email}`);
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.resultados)) {
        setCitas(data.resultados);
      } else {
        setCitas([]);
        if (data.mensaje) alert(data.mensaje);
      }
    } catch (e) {
      console.error(e);
      alert("Error cargando citas");
    } finally {
      setLoading(false);
    }
  };

  const agregarCita = async (nuevaCita) => {
    if (!email) return alert("Primero ingresa el correo del paciente");
    try {
      const hora = /^\d{2}:\d{2}$/.test(nuevaCita.hora)
        ? `${nuevaCita.hora}:00`
        : nuevaCita.hora;

      const body = {
        paciente_id: email,         
        fecha: nuevaCita.fecha,
        hora,                      
        motivo: nuevaCita.motivo,
      };

      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.Exitoso) {
        alert("✅ Cita agendada");
        await cargarCitas();
      } else if (data.Error) {
        alert("❌ " + (Array.isArray(data.Error) ? data.Error.join("\n") : String(data.Error)));
      } else {
        alert("❌ Respuesta inesperada del servidor");
        console.log("Respuesta:", data);
      }
    } catch (e) {
      console.error(e);
      alert("Error al agendar cita");
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: 20 }}>
      <h1>VitalApp 🏥</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Correo del paciente"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          style={{ padding: 6, width: 280 }}
        />
        <button onClick={cargarCitas} style={{ marginLeft: 10 }}>Consultar citas</button>
      </div>

      <AgendarCita onAgendar={agregarCita} />
      {loading ? <p>Cargando...</p> : <ConsultarCitas citas={citas} />}
    </div>
  );
}

export default App;
