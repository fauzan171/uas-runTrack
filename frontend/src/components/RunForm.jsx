import { useState, useEffect } from 'react'

const EMPTY = { distance: '', duration: '', date: '', notes: '' }

export default function RunForm({ onSubmit, editing }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (editing) {
      setForm({
        distance: editing.distance,
        duration: editing.duration,
        date: editing.date.slice(0, 10),
        notes: editing.notes || '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [editing])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      distance: parseFloat(form.distance),
      duration: parseInt(form.duration),
    })
    if (!editing) setForm(EMPTY)
  }

  return (
    <div className="card">
      <h2>{editing ? 'Edit Sesi Lari' : 'Catat Sesi Lari Baru'}</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Jarak (km)</label>
          <input
            type="number"
            step="0.1"
            name="distance"
            value={form.distance}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Durasi (menit)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tanggal</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 2 }}>
          <label>Catatan</label>
          <input
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn">
          {editing ? 'Simpan' : 'Tambah'}
        </button>
      </form>
    </div>
  )
}
