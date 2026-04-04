export default function GrammarBox({ grammar }) {
  return (
    <div className="card">
      <div className="card-title">📐 Grammar / Dilbilgisi</div>
      <div className="grammar-box">
        <h3>{grammar.title}</h3>
        <p style={{ marginBottom: 8 }}>{grammar.explanation}</p>
        <p style={{ fontSize: 13, color: '#64748b' }}>{grammar.explanationTr}</p>
      </div>

      <table className="grammar-table">
        <thead>
          <tr>
            <th>Pronoun</th>
            <th>Be</th>
            <th>Türkçe</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {grammar.table.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {grammar.tips && (
        <div style={{ marginTop: 16 }}>
          <strong style={{ fontSize: 14 }}>💡 Tips / İpuçları:</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {grammar.tips.map((tip, i) => (
              <li key={i} style={{ fontSize: 14, marginBottom: 4 }}>
                <strong>{tip.en}</strong> — <span style={{ color: '#64748b' }}>{tip.tr}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
