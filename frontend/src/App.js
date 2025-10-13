import React, { useState, useEffect } from "react";
import AgendarCita from "./components/AgendarCitas";
import ConsultarCitas from "./components/ConsultarCitas";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const pacienteId = "ed029278-59a5-4ea3-aa4c-439787707313"; // ID de prueba o simulado

    fetch(`${BACKEND_URL}/citas/resultados/${pacienteId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorMsg = await res.text();
          throw new Error(`Error ${res.status}: ${errorMsg}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCitas(data);
        } else {
          console.error("Respuesta inesperada del backend:", data);
          setCitas([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando citas desde backend:", err);
        alert("⚠️ Error cargando citas desde el servidor");
      });
  }, []);

  // Enviar nueva cita al backend
  const agregarCita = async (nuevaCita) => {
    try {
      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita),
      });

      if (!res.ok) throw new Error("Error al agendar cita");

      const data = await res.json();
      setCitas((prev) => [...prev, data]);
      alert("✅ Cita agendada con éxito.");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo agendar la cita.");
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <h1>VitalApp 🏥</h1>
      <AgendarCita onAgendar={agregarCita} />
      <ConsultarCitas citas={citas} />
    </div>
  );
}

export default App;
