import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { CATEGORIES } from '../constants'

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    category: 'Others',
    description: '',
    quantity: 0,
    price: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/products/${id}`)
      .then(({ data }) =>
        setForm({
          name: data.name,
          category: data.category || 'Others',
          description: data.description ?? '',
          quantity: data.quantity,
          price: data.price,
        })
      )
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Keep an old category visible if it is not in the list anymore
  const categoryOptions =
    form.category && !CATEGORIES.includes(form.category)
      ? [...CATEGORIES, form.category]
      : CATEGORIES

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...form,
      quantity: form.quantity === '' ? null : Number(form.quantity),
      price: form.price === '' ? null : Number(form.price),
    }
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const fieldErrors = data?.errors ? Object.values(data.errors).join('. ') : null
      setError(fieldErrors || data?.message || 'Could not save the product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container muted">Loading...</div>

  return (
    <div className="container">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h1>{isEdit ? 'Edit product' : 'Add product'}</h1>

        {error && <div className="alert">{error}</div>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} autoFocus />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Description</label>
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />

        <div className="row">
          <div>
            <label>Quantity</label>
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
          </div>
          <div>
            <label>Price (RM)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
          </div>
        </div>

        <div className="actions form-actions">
          <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <Link to="/" className="btn btn-secondary btn-link">Cancel</Link>
        </div>
      </form>
    </div>
  )
}