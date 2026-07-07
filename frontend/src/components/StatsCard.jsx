export default function StatsCard({ stats }) {
  if (!stats) return null

  // pace dalam menit per km, format jadi menit:detik
  const paceMin = Math.floor(stats.avgPace)
  const paceSec = Math.round((stats.avgPace - paceMin) * 60)
  const paceStr = `${paceMin}:${String(paceSec).padStart(2, '0')}`

  return (
    <div className="stats-grid">
      <div className="stat-box">
        <div className="stat-value">{stats.totalKm}</div>
        <div className="stat-label">Total Jarak (km)</div>
      </div>
      <div className="stat-box">
        <div className="stat-value">{paceStr}</div>
        <div className="stat-label">Pace Rata-rata (min/km)</div>
      </div>
      <div className="stat-box">
        <div className="stat-value">{stats.totalSessions}</div>
        <div className="stat-label">Jumlah Sesi</div>
      </div>
    </div>
  )
}
