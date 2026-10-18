export default function StockChart({ products }) {
  if (products.length === 0) {
    return <p className="muted">No items to show yet.</p>
  }

  const max = Math.max(...products.map((p) => p.quantity), 1)

  return (
    <div className="chart-scroll">
      <div className="chart" style={{ minWidth: products.length * 72 }}>
        {products.map((p) => (
          <div className="chart-col" key={p.id}>
            <span className="chart-value">{p.quantity}</span>
            <div className="chart-bar-area">
              <div
                className={`chart-bar ${p.quantity < 5 ? 'low' : ''}`}
                style={{ height: `${(p.quantity / max) * 100}%` }}
                title={`${p.name}: ${p.quantity} left`}
              />
            </div>
            <span className="chart-label" title={p.name}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}