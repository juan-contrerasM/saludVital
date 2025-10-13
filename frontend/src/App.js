import React, { useState, useEffect } from "react";
import AgendarCita from "./components/AgendarCitas";
import ConsultarCitas from "./components/ConsultarCitas";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PACIENTE_ID = "ed029278-59a5-4ea3-aa4c-439787707313"; // ID de prueba o simulado

function App() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para cargar las citas desde el backend
  const cargarCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/citas/resultados/${PACIENTE_ID}`);

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`Error ${res.status}: ${errorMsg}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCitas(data);
      } else {
        console.error("⚠️ Respuesta inesperada del backend:", data);
        setCitas([]);
      }
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
      alert("Error cargando citas desde el servidor");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar citas al iniciar la app
  useEffect(() => {
    cargarCitas();
  }, []);

  // 🔹 Enviar nueva cita al backend
  const agregarCita = async (nuevaCita) => {
    try {
      const res = await fetch(`${BACKEND_URL}/citas/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita),
      });

      if (!res.ok) throw new Error("Error al agendar cita");

      await res.json(); // Ignoramos el contenido, solo esperamos la confirmación
      alert("✅ Cita agendada con éxito.");

      // 🔄 Recargar las citas actualizadas
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
