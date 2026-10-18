import { useEffect, useState } from 'react'
import api from '../api'

function toDate(value) {
  if (!value) return null
  return Array.isArray(value)
    ? new Date(value[0], value[1] - 1, value[2], value[3] || 0, value[4] || 0, value[5] || 0)
    : new Date(value)
}

function formatTime(value) {
  const date = toDate(value)
  return date ? date.toLocaleString() : '-'
}

function describe(log) {
  if (log.action === 'CREATED') return 'New product added'
  if (log.action === 'DELETED') return 'Product deleted'
  return (
    <>
      <strong>{log.fieldName}</strong>: {log.oldValue || '(empty)'} → {log.newValue || '(empty)'}
    </>
  )
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    api
      .get('/logs')
      .then(({ data }) => setLogs(data))
      .catch(() => setError('Could not load the change log'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs.filter((log) => {
    if (action && log.action !== action) return false
    if (search && !(log.productName || '').toLowerCase().includes(search.trim().toLowerCase())) {
      return false
    }
    if (from || to) {
      const time = toDate(log.changedAt)
      if (!time) return false
      if (from && time < new Date(`${from}T00:00:00`)) return false
      if (to && time > new Date(`${to}T23:59:59`)) return false
    }
    return true
  })

  const hasFilters = search || action || from || to

  const clearFilters = () => {
    setSearch('')
    setAction('')
    setFrom('')
    setTo('')
  }

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>Change log</h1>
          <span className="muted">
            Your latest changes, newest first · showing {filtered.length} of {logs.length}
          </span>
        </div>
      </header>

      <div className="card">
        <div className="toolbar">
          <input
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">All actions</option>
            <option value="CREATED">Created</option>
            <option value="UPDATED">Updated</option>
            <option value="DELETED">Deleted</option>
          </select>
          <label className="inline-label">
            From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="inline-label">
            To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Clear
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="table-wrap log-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Product</th>
                <th>Action</th>
                <th>Change</th>
                <th>Changed by</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="muted">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="muted">No changes yet.</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="muted">No changes match your filters.</td></tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id}>
                    <td>{formatTime(log.changedAt)}</td>
                    <td>{log.productName}</td>
                    <td>{log.action}</td>
                    <td>{describe(log)}</td>
                    <td>{log.changedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}