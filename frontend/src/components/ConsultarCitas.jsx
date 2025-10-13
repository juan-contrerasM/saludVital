function ConsultarCitas({ citas }) {
  const citasValidas = Array.isArray(citas) ? citas : [];

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Resultados de citas</h2>
      {citasValidas.length === 0 ? (
        <p>No hay resultados disponibles.</p>
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
              <th>Tipo de examen</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {citasValidas.map((cita) => (
              <tr key={cita.id}>
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
