import React, { useState, useEffect } from "react";
import AgendarCita from "./components/AgendarCitas";
import ConsultarCitas from "./components/ConsultarCitas";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PACIENTE_ID = "ed029278-59a5-4ea3-aa4c-439787707313"; // ID fijo o simulado

function App() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar citas desde backend
  const cargarCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/citas/resultados/${PACIENTE_ID}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCitas(Array.isArray(data.resultados) ? data.resultados : []);
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
      alert("Error cargando citas desde el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  // 🔹 Enviar nueva cita (agregando el paciente_id)
  const agregarCita = async (nuevaCita) => {
    try {
      const citaConId = { ...nuevaCita, paciente_id: PACIENTE_ID };

      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaConId),
      });

      if (!res.ok) throw new Error("Error al agendar cita");

      await res.json();
      alert("✅ Cita agendada con éxito.");
      await cargarCitas();
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo agendar la cita.");
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <h1>VitalApp 🏥</h1>
      <AgendarCita onAgendar={agregarCita} />
      {loading ? (
        <p>Cargando citas...</p>
      ) : (
        <ConsultarCitas citas={citas} />
      )}
    </div>
  );
}

export default App;
