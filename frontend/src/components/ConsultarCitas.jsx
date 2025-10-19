import React from "react";

function ConsultarCitas({ citas }) {
  const citasValidas = Array.isArray(citas) ? citas : [];

  const formatearFecha = (f) => {
    // Si viene "YYYY-MM-DD" la dejamos tal cual; si viene ISO, intentamos formatear
    if (!f) return "-";
    // Caso simple: ya es YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return f;
    // Intento de formateo si es ISO u otro
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
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Fecha</th>
              <th style={{ textAlign: "left", padding: 8 }}>Tipo</th>
              <th style={{ textAlign: "left", padding: 8 }}>Descripción</th>
              <th style={{ textAlign: "left", padding: 8 }}>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {citasValidas.map((cita, i) => {
              // Back puede devolver: { tipo, fecha, descripcion, url }
              const fecha = cita.fecha || cita.fecha_resultado || "";
              const tipo = cita.tipo || cita.tipo_examen || "-";
              const descripcion = cita.descripcion || cita.resultado || "-";
              const url = cita.url || cita.enlace || null;

              return (
                <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{formatearFecha(fecha)}</td>
                  <td style={{ padding: 8 }}>{tipo}</td>
                  <td style={{ padding: 8 }}>{descripcion}</td>
                  <td style={{ padding: 8 }}>
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
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
