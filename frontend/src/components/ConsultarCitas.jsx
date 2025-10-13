import React from "react";

function ConsultarCitas({ citas }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Citas agendadas</h2>
      {citas.length === 0 ? (
        <p>No hay citas disponibles.</p>
      ) : (
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            width: "70%",
          }}
        >
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, i) => (
              <tr key={i}>
                <td>{cita.fecha}</td>
                <td>{cita.hora}</td>
                <td>{cita.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConsultarCitas;
