import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../../api/productsAPI'
import { getCollections } from '../../api/collectionsAPI'
import Footer from '../../components/Footer'
import toast from 'react-hot-toast'

export default function AddProduct() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    collection_id: '',
    title: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '',
    category: '',
    brand: '',
    sizes: '',
    colors: '',
    is_featured: false
  })

  useEffect(() => {
    getCollections()
      .then(res => setCollections(res.data))
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (imageFile) formData.append('main_image', imageFile)
      await createProduct(formData)
      toast.success('Product added!')
      navigate('/collections')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--cream)' }}>
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1.2fr',
        minHeight: 'calc(100vh - 64px)', alignItems: 'start'
      }}>

        {/* Left panel */}
        <div style={{
          padding: '72px 6%', position: 'sticky', top: '64px'
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '4px',
            color: 'var(--gray-mid)', marginBottom: '12px'
          }}>
            ADMIN PANEL
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 300, lineHeight: 1.1, marginBottom: '20px'
          }}>
            Add<br /><em>Product</em>
          </h1>
          <p style={{
            fontSize: '14px', color: 'var(--gray-dark)',
            lineHeight: 1.8, maxWidth: '320px'
          }}>
            Upload premium fashion products with pricing, stock, categories, and elegant visuals.
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--white)', padding: '60px 48px',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <form onSubmit={handleSubmit}>

            {/* Collection */}
            <FormGroup label="Collection">
              <select
                name="collection_id"
                value={form.collection_id}
                onChange={handleChange}
                required
                style={selectStyle}
              >
                <option value="">Select Collection</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </FormGroup>

            {/* Title */}
            <FormGroup label="Product Title">
              <input
                name="title" value={form.title}
                onChange={handleChange} placeholder="Product title"
                required style={inputStyle}
              />
            </FormGroup>

            {/* Description */}
            <FormGroup label="Description">
              <textarea
                name="description" value={form.description}
                onChange={handleChange} placeholder="Describe this product..."
                rows={4} style={{ ...inputStyle, resize: 'vertical' }}
              />
            </FormGroup>

            {/* Price row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormGroup label="Price">
                <input
                  name="price" type="number" value={form.price}
                  onChange={handleChange} placeholder="0.00"
                  required style={inputStyle}
                />
              </FormGroup>
              <FormGroup label="Discount Price">
                <input
                  name="discount_price" type="number" value={form.discount_price}
                  onChange={handleChange} placeholder="0.00"
                  style={inputStyle}
                />
              </FormGroup>
            </div>

            {/* Stock + Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormGroup label="Stock">
                <input
                  name="stock" type="number" value={form.stock}
                  onChange={handleChange} placeholder="0"
                  required style={inputStyle}
                />
              </FormGroup>
              <FormGroup label="Category">
                <input
                  name="category" value={form.category}
                  onChange={handleChange} placeholder="e.g. Dresses"
                  style={inputStyle}
                />
              </FormGroup>
            </div>

            {/* Brand */}
            <FormGroup label="Brand">
              <input
                name="brand" value={form.brand}
                onChange={handleChange} placeholder="Brand name"
                style={inputStyle}
              />
            </FormGroup>

            {/* Sizes + Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormGroup label="Sizes (comma separated)">
                <input
                  name="sizes" value={form.sizes}
                  onChange={handleChange} placeholder="XS, S, M, L, XL"
                  style={inputStyle}
                />
              </FormGroup>
              <FormGroup label="Colors (comma separated)">
                <input
                  name="colors" value={form.colors}
                  onChange={handleChange} placeholder="Black, White, Red"
                  style={inputStyle}
                />
              </FormGroup>
            </div>

            {/* Image upload */}
            <FormGroup label="Product Image">
              <label style={{
                display: 'block', border: '2px dashed #ddd',
                borderRadius: '12px', padding: '32px',
                textAlign: 'center', cursor: 'pointer',
                background: 'var(--gray-light)'
              }}>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      maxHeight: '200px', borderRadius: '8px',
                      margin: '0 auto'
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: '13px', color: 'var(--gray-mid)',
                    letterSpacing: '1px'
                  }}>
                    Upload Product Image
                  </p>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={handleImage}
                  style={{ display: 'none' }}
                />
              </label>
            </FormGroup>

            {/* Featured */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '10px', marginBottom: '32px'
            }}>
              <input
                type="checkbox" name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                id="featured"
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="featured" style={{
                fontSize: '13px', color: 'var(--gray-dark)'
              }}>
                Featured Product
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  flex: 1, padding: '16px', borderRadius: '50px',
                  border: '1.5px solid #ddd', background: 'transparent',
                  fontSize: '11px', letterSpacing: '2px', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: '16px', borderRadius: '50px',
                  border: 'none', background: 'var(--black)',
                  color: 'var(--white)', fontSize: '11px',
                  letterSpacing: '2px', fontWeight: 600,
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'ADDING...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        fontSize: '10px', letterSpacing: '2px',
        color: 'var(--gray-mid)', display: 'block', marginBottom: '8px'
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '14px 16px',
  border: '1px solid #e0e0e0', borderRadius: '10px',
  fontSize: '14px', outline: 'none',
  fontFamily: 'var(--font-sans)',
  background: 'var(--gray-light)'
}

const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer'
}