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
        if (data.status === "ok" && Array.isArray(data.resultados)) {
          setCitas(data.resultados);
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
      const pacienteId = "ed029278-59a5-4ea3-aa4c-439787707313"; // ID fijo
      const body = { ...nuevaCita, paciente_id: pacienteId };

      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al agendar cita");

      const data = await res.json();

      if (data.Exitoso) {
        // Recargar resultados desde backend después de agendar
        const resultadosRes = await fetch(`${BACKEND_URL}/citas/resultados/${pacienteId}`);
        const resultadosData = await resultadosRes.json();
        if (resultadosData.status === "ok" && Array.isArray(resultadosData.resultados)) {
          setCitas(resultadosData.resultados);
        }
        alert("✅ Cita agendada con éxito.");
      } else {
        console.error("Error en la respuesta al agendar cita:", data);
        alert("❌ No se pudo agendar la cita correctamente.");
      }
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
