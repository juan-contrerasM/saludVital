import React, { useState } from "react";
import AgendarCita from "./components/AgendarCitas";
import ConsultarCitas from "./components/ConsultarCitas";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = { rawText: await res.text() };
  }
  return { res, data };
}

function App() {
  const [email, setEmail] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarCitas = async () => {
    if (!email) return alert("Ingresa un correo válido");
    try {
      setLoading(true);
      const r = await fetch(`${BACKEND_URL}/citas/resultados/${email}`);
      const data = await r.json();
      if (data.status === "ok" && Array.isArray(data.resultados)) {
        setCitas(data.resultados);
      } else {
        setCitas([]);
        if (data.mensaje) alert(data.mensaje);
      }
    } catch (e) {
      console.error("Error cargando citas:", e);
      alert("⚠️ Error al cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  const agregarCita = async (nuevaCita) => {
    if (!email) return alert("Primero ingresa el correo del paciente.");
    try {
      // Asegurar formato HH:MM:SS
      const hora = /^\d{2}:\d{2}$/.test(nuevaCita.hora)
        ? `${nuevaCita.hora}:00`
        : nuevaCita.hora;

      // 1) Body plano con ambos campos: paciente_id y correo
      const bodyPlano = {
        paciente_id: email,   // por si el back usa este nombre
        correo: email,        // ← el server actual lo está pidiendo
        fecha: nuevaCita.fecha,
        hora,
        motivo: nuevaCita.motivo,
      };

      console.log("[DEBUG] Body plano -> /citas/agendar:", bodyPlano);
      let { res, data } = await postJSON(`${BACKEND_URL}/citas/agendar`, bodyPlano);

      // 2) Si 422, reintenta con body embebido: { cita: { ... } }
      if (res.status === 422) {
        console.warn("[DEBUG] 422 con body plano. detail:", data.detail || data);
        const bodyEmbebido = { cita: bodyPlano };
        console.log("[DEBUG] Reintentando con body embebido:", bodyEmbebido);
        ({ res, data } = await postJSON(`${BACKEND_URL}/citas/agendar`, bodyEmbebido));
      }

      if (!res.ok) {
        console.error(`Error HTTP ${res.status}`, data);
        const detalle = data.detail ? JSON.stringify(data.detail, null, 2) : JSON.stringify(data);
        alert(`❌ Error al agendar (HTTP ${res.status}).\n${detalle}`);
        return;
      }

      console.log("Respuesta agendar:", data);

      if (data.Exitoso) {
        alert("✅ Cita agendada con éxito.");
        await cargarCitas();
      } else if (data.Error) {
        alert("❌ " + (Array.isArray(data.Error) ? data.Error.join("\n") : String(data.Error)));
      } else {
        alert("❌ Respuesta inesperada del servidor.");
        console.log("Respuesta:", data);
      }
    } catch (e) {
      console.error("Error al agendar cita:", e);
      alert("❌ No se pudo agendar la cita.");
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
