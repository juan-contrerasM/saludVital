import React from "react";

function ConsultarCitas({ citas }) {
  const citasValidas = Array.isArray(citas) ? citas : [];

  const formatearFecha = (f) => {
    if (!f) return "-";
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return f;
    const d = new Date(f);
    if (isNaN(d.getTime())) return f;
    return d.toLocaleString("es-CO", { timeZone: "America/Bogota" });
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Citas agendadas</h2>

      {citasValidas.length === 0 ? (
        <p>No hay citas disponibles o ocurrió un error.</p>
      ) : (
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            width: "90%",
            maxWidth: 900,
            textAlign: "left",
            fontSize: "15px",
            border: "1px solid #ddd",
          }}
        >
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th style={{ padding: "10px 8px", borderBottom: "2px solid #ccc" }}>Fecha</th>
              <th style={{ padding: "10px 8px", borderBottom: "2px solid #ccc" }}>Tipo</th>
              <th style={{ padding: "10px 8px", borderBottom: "2px solid #ccc" }}>Descripción</th>
            </tr>
          </thead>

          <tbody>
            {citasValidas.map((cita, i) => {
              const fecha = cita.fecha || cita.fecha_resultado || "";
              const tipo = cita.tipo || cita.tipo_examen || "-";
              const descripcion = cita.descripcion || cita.resultado || "-";

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: 8 }}>{formatearFecha(fecha)}</td>
                  <td style={{ padding: 8 }}>{tipo}</td>
                  <td style={{ padding: 8 }}>{descripcion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConsultarCitas;
