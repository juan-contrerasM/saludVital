import React, { useState } from "react";
import AgendarCita from "./components/AgendarCita";
import ConsultarCitas from "./components/ConsultarCitas";

// CRA: REACT_APP_BACKEND_URL=http://54.90.87.198:8000  (o tu URL)
// Quita slash final si lo tiene
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

function App() {
  const [email, setEmail] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarCitas = async () => {
    if (!email) {
      alert("Ingresa un correo válido");
      return;
    }
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
    } catch (error) {
      console.error("Error cargando citas:", error);
      alert("⚠️ Error al cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  const agregarCita = async (nuevaCita) => {
    if (!email) {
      alert("Primero ingresa el correo del paciente.");
      return;
    }

    try {
      // Asegurar formato HH:MM:SS para el backend
      const hora = /^\d{2}:\d{2}$/.test(nuevaCita.hora)
        ? `${nuevaCita.hora}:00`
        : nuevaCita.hora;

      const body = {
        paciente_id: email,        // <- EXIGIDO por tu backend
        fecha: nuevaCita.fecha,    // 'YYYY-MM-DD' (input date)
        hora,                      // 'HH:MM:SS' (normalizado arriba)
        motivo: nuevaCita.motivo,
      };

      console.log("[DEBUG] Body que envío a /citas/agendar:", body);

      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Intenta parsear el JSON siempre, incluso en error
      let data;
      try {
        data = await res.json();
      } catch {
        data = { rawText: await res.text() };
      }

      if (!res.ok) {
        // Si es 422, mostrar exactamente el campo faltante
        if (res.status === 422 && data && Array.isArray(data.detail)) {
          const faltantes = data.detail
            .map((d) => (Array.isArray(d.loc) ? d.loc.join(".") : d.msg || "Campo faltante"))
            .join(" | ");
          console.error("Validación 422:", data);
          alert(`❌ Validación (422). Revisa campos: ${faltantes}`);
        } else {
          console.error("Error HTTP:", res.status, data);
          alert(`❌ Error al agendar cita (HTTP ${res.status}).`);
        }
        return;
      }

      console.log("Respuesta:", data);

      if (data.Exitoso) {
        alert("✅ Cita agendada con éxito.");
        await cargarCitas();
      } else if (data.Error) {
        alert("❌ " + (Array.isArray(data.Error) ? data.Error.join("\n") : String(data.Error)));
      } else {
        alert("❌ Respuesta inesperada del servidor.");
        console.log("Respuesta inesperada:", data);
      }
    } catch (error) {
      console.error("Error al agendar cita:", error);
      alert("❌ No se pudo agendar la cita.");
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: 20 }}>
      <h1>VitalApp 🏥</h1>

      {/* correo = paciente_id */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Correo del paciente"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          style={{ padding: 6, width: 280 }}
        />
        <button onClick={cargarCitas} style={{ marginLeft: 10 }}>
          Consultar citas
        </button>
      </div>

      <AgendarCita onAgendar={agregarCita} />
      {loading ? <p>Cargando...</p> : <ConsultarCitas citas={citas} />}
    </div>
  );
}

export default App;
