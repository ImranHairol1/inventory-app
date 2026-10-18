import { useEffect, useState } from 'react'
import api from '../api'

function formatTime(value) {
  if (!value) return '-'
  const date = Array.isArray(value)
    ? new Date(value[0], value[1] - 1, value[2], value[3] || 0, value[4] || 0, value[5] || 0)
    : new Date(value)
  return date.toLocaleString()
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

  useEffect(() => {
    api
      .get('/logs')
      .then(({ data }) => setLogs(data))
      .catch(() => setError('Could not load the change log'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>Change log</h1>
          <span className="muted">Your latest changes, newest first</span>
        </div>
      </header>

      <div className="card">
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
              ) : (
                logs.map((log) => (
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