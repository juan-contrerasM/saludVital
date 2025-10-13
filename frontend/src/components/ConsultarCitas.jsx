import React from "react";

function ConsultarCitas({ citas }) {
  const citasValidas = Array.isArray(citas) ? citas : [];

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Citas agendadas</h2>
      {citasValidas.length === 0 ? (
        <p>No hay citas disponibles o ocurrió un error.</p>
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
              <th>Tipo de Examen</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {citasValidas.map((cita, i) => (
              <tr key={i}>
                <td>{cita.fecha}</td>
                <td>{cita.tipo_examen}</td>
                <td>{cita.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConsultarCitas;
