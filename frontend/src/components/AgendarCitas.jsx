import React, { useState } from "react";

function AgendarCita({ onAgendar }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !hora || !motivo) {
      alert("Por favor completa todos los campos");
      return;
    }
    onAgendar({ fecha, hora, motivo });
    setFecha("");
    setHora("");
    setMotivo("");
  };

  return (
    <div style={{ margin: "20px auto", width: 320 }}>
      <h2>Agendar cita</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
          // Tu backend pide HH:MM:SS; App.js añade ':00' si faltan segundos
        />
        <input
          type="text"
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
        />
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
}

export default AgendarCita;
