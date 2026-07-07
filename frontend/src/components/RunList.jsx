export default function RunList({ runs, onEdit, onDelete }) {
  if (!runs.length) {
    return (
      <div className="card">
        <h2>Riwayat Sesi Lari</h2>
        <p className="muted">Belum ada sesi lari tercatat.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Riwayat Sesi Lari</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Jarak (km)</th>
            <th>Durasi (m)</th>
            <th>Pace (min/km)</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => {
            const pace = r.distance > 0 ? (r.duration / r.distance).toFixed(2) : '-'
            return (
              <tr key={r.id}>
                <td>{r.date.slice(0, 10)}</td>
                <td>{r.distance}</td>
                <td>{r.duration}</td>
                <td>{pace}</td>
                <td>{r.notes || '-'}</td>
                <td className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(r.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
