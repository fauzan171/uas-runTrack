import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import StatsCard from '../components/StatsCard'
import RunForm from '../components/RunForm'
import RunList from '../components/RunList'

export default function DashboardPage() {
  const [runs, setRuns] = useState([])
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [r, s] = await Promise.all([api.getRuns(), api.getStats()])
      setRuns(r)
      setStats(s)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSubmit(values) {
    setError('')
    try {
      if (editing) {
        await api.updateRun(editing.id, values)
        setEditing(null)
      } else {
        await api.createRun(values)
      }
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus sesi lari ini?')) return
    setError('')
    try {
      await api.deleteRun(id)
      if (editing && editing.id === id) setEditing(null)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(run) {
    setEditing(run)
  }

  function handleCancelEdit() {
    setEditing(null)
  }

  return (
    <>
      {error && <div className="error-msg">{error}</div>}
      <StatsCard stats={stats} />
      <RunForm onSubmit={handleSubmit} editing={editing} />
      {editing && (
        <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={handleCancelEdit}>
          Batal Edit
        </button>
      )}
      <RunList runs={runs} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  )
}
