import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCollection } from '../../api/collectionsAPI'
import Footer from '../../components/Footer'
import toast from 'react-hot-toast'

export default function AddCollection() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({ title: '', description: '' })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

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
      formData.append('title', form.title)
      formData.append('description', form.description)
      if (imageFile) formData.append('banner_image', imageFile)
      await createCollection(formData)
      toast.success('Collection created!')
      navigate('/collections')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create collection')
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
        <div style={{ padding: '72px 6%', position: 'sticky', top: '64px' }}>
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
            Add<br /><em>Collection</em>
          </h1>
          <p style={{
            fontSize: '14px', color: 'var(--gray-dark)',
            lineHeight: 1.8, maxWidth: '320px'
          }}>
            Create a new luxury collection with a title, description, and banner image.
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--white)', padding: '60px 48px',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <form onSubmit={handleSubmit}>

            <FormGroup label="Collection Title">
              <input
                name="title" value={form.title}
                onChange={handleChange}
                placeholder="e.g. Summer Couture 2026"
                required
                style={inputStyle}
              />
            </FormGroup>

            <FormGroup label="Description">
              <textarea
                name="description" value={form.description}
                onChange={handleChange}
                placeholder="Describe this collection..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </FormGroup>

            {/* Banner image */}
            <FormGroup label="Banner Image">
              <label style={{
                display: 'block', border: '2px dashed #ddd',
                borderRadius: '12px', padding: '40px',
                textAlign: 'center', cursor: 'pointer',
                background: 'var(--gray-light)'
              }}>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      maxHeight: '220px', borderRadius: '8px',
                      margin: '0 auto', objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div>
                    <p style={{
                      fontSize: '32px', marginBottom: '8px'
                    }}>
                      🖼
                    </p>
                    <p style={{
                      fontSize: '13px', color: 'var(--gray-mid)',
                      letterSpacing: '1px'
                    }}>
                      Upload Banner Image
                    </p>
                  </div>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={handleImage}
                  style={{ display: 'none' }}
                />
              </label>
            </FormGroup>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
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
                {loading ? 'CREATING...' : 'Create Collection'}
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
    <div style={{ marginBottom: '24px' }}>
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