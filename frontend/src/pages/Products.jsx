import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { CATEGORIES } from '../constants'
import StockChart from '../components/StockChart'

export default function Products() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [direction, setDirection] = useState('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // The table: follows the search, category and sort controls
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/products', {
          params: { search, category, sortBy, direction },
        })
        setProducts(data)
      } catch {
        setError('Could not load products. Is the server running?')
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, category, sortBy, direction, reloadKey])

  // The chart: always all of your items
  useEffect(() => {
    api
      .get('/products', { params: { sortBy: 'name', direction: 'asc' } })
      .then(({ data }) => setAllProducts(data))
      .catch(() => {})
  }, [reloadKey])

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await api.delete(`/products/${product.id}`)
      setReloadKey((k) => k + 1)
    } catch {
      setError('Could not delete the product')
    }
  }

  const totalValue = products.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0)

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>Inventory</h1>
          <span className="muted">
            {products.length} item(s) · stock value RM {totalValue.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="card">
        <div className="toolbar">
          <input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Sort: Date added</option>
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="quantity">Sort: Quantity</option>
          </select>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <Link to="/products/new" className="btn btn-link">+ Add product</Link>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="table-wrap table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price (RM)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="muted">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="muted">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      {p.description && <div className="muted small desc">{p.description}</div>}
                    </td>
                    <td>{p.category || '-'}</td>
                    <td>
                      {p.quantity}
                      {p.quantity < 5 && <span className="badge-low">Low stock</span>}
                    </td>
                    <td>{Number(p.price).toFixed(2)}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/products/${p.id}/edit`} className="btn btn-secondary btn-link">Edit</Link>
                        <button className="btn btn-danger" onClick={() => handleDelete(p)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card chart-card">
        <h2>Stock left per item</h2>
        <StockChart products={allProducts} />
      </div>
    </div>
  )
}