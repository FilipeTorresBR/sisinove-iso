export default function DataTable({ rows }) {
  if (!rows?.length)
    return (
      <div className="panel">
        <p>Nenhum registro encontrado.</p>
      </div>
    );

  const headers = Object.keys(rows[0]);

  return (
    <div className="table-wrapper panel">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>
                  {/* REMOVEMOS o String() para aceitar o Link JSX */}
                  {row[header] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
