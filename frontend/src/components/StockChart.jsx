import { useState } from 'react'

const SLOT = 72
const BAR_WIDTH = 36
const HEIGHT = 280
const MARGIN = { top: 24, right: 16, bottom: 52, left: 44 }

function makeScale(maxValue) {
  const rawStep = Math.max(maxValue, 5) / 5
  const power = 10 ** Math.floor(Math.log10(rawStep))
  const n = rawStep / power
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * power
  const axisMax = Math.max(Math.ceil(maxValue / step) * step, step)
  const ticks = []
  for (let t = 0; t <= axisMax; t += step) ticks.push(t)
  return { axisMax, ticks }
}

function shorten(name) {
  return name.length > 10 ? name.slice(0, 9) + '…' : name
}

export default function StockChart({ products }) {
  const [mode, setMode] = useState('bar')
  const [hidden, setHidden] = useState(() => new Set())

  const visible = products.filter((p) => !hidden.has(p.id))
  const hiddenCount = products.length - visible.length

  const plotWidth = Math.max(visible.length * SLOT, 320)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const svgWidth = MARGIN.left + plotWidth + MARGIN.right
  const { axisMax, ticks } = makeScale(Math.max(0, ...visible.map((p) => p.quantity)))

  const yOf = (value) => MARGIN.top + plotHeight - (value / axisMax) * plotHeight
  const xOf = (index) => MARGIN.left + index * SLOT + SLOT / 2

  const hide = (id) => setHidden((prev) => new Set(prev).add(id))
  const reset = () => setHidden(new Set())

  return (
    <div>
      <div className="chart-header">
        <div>
          <h2>Stock left per item</h2>
          <span className="muted small">
            Click a {mode === 'bar' ? 'bar' : 'point'} to hide it
          </span>
        </div>
        <div className="chart-controls">
          <div className="segmented">
            <button
              type="button"
              className={mode === 'bar' ? 'active' : ''}
              onClick={() => setMode('bar')}
            >
              Bar
            </button>
            <button
              type="button"
              className={mode === 'line' ? 'active' : ''}
              onClick={() => setMode('line')}
            >
              Line
            </button>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={reset}
            disabled={hiddenCount === 0}
          >
            Reset{hiddenCount > 0 ? ` (${hiddenCount} hidden)` : ''}
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="muted">No items to show yet.</p>
      ) : visible.length === 0 ? (
        <p className="muted">All items are hidden. Press Reset to show them again.</p>
      ) : (
        <>
          <div className="stock-scroll">
            <svg width={svgWidth} height={HEIGHT} role="img" aria-label="Stock left per item">
              <text x="4" y="10" className="axis-title">Qty</text>

              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={MARGIN.left}
                    x2={MARGIN.left + plotWidth}
                    y1={yOf(t)}
                    y2={yOf(t)}
                    className="grid-line"
                  />
                  <text x={MARGIN.left - 8} y={yOf(t) + 4} textAnchor="end" className="axis-text">
                    {t}
                  </text>
                </g>
              ))}

              {mode === 'bar' &&
                visible.map((p, i) => {
                  const height = Math.max(yOf(0) - yOf(p.quantity), 2)
                  return (
                    <rect
                      key={p.id}
                      x={xOf(i) - BAR_WIDTH / 2}
                      y={yOf(0) - height}
                      width={BAR_WIDTH}
                      height={height}
                      rx="4"
                      className={`stock-bar ${p.quantity < 5 ? 'low' : ''}`}
                      onClick={() => hide(p.id)}
                    >
                      <title>{`${p.name}: ${p.quantity} left (click to hide)`}</title>
                    </rect>
                  )
                })}

              {mode === 'line' && (
                <>
                  <polyline
                    fill="none"
                    className="stock-line"
                    points={visible.map((p, i) => `${xOf(i)},${yOf(p.quantity)}`).join(' ')}
                  />
                  {visible.map((p, i) => (
                    <circle
                      key={p.id}
                      cx={xOf(i)}
                      cy={yOf(p.quantity)}
                      r="6"
                      className={`stock-point ${p.quantity < 5 ? 'low' : ''}`}
                      onClick={() => hide(p.id)}
                    >
                      <title>{`${p.name}: ${p.quantity} left (click to hide)`}</title>
                    </circle>
                  ))}
                </>
              )}

              {visible.map((p, i) => (
                <text
                  key={p.id}
                  x={xOf(i)}
                  y={yOf(0) + 18}
                  textAnchor="middle"
                  className="axis-text"
                >
                  {shorten(p.name)}
                  <title>{p.name}</title>
                </text>
              ))}
            </svg>
          </div>

          <div className="chart-legend">
            <span><i className="legend-dot blue" /> 5 or more in stock</span>
            <span><i className="legend-dot yellow" /> Low stock (under 5)</span>
          </div>
        </>
      )}
    </div>
  )
}