import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getSingleCollection,
  getCollectionProducts,
  deleteCollection
} from '../api/collectionsAPI'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSingleCollection(id),
      getCollectionProducts(id)
    ])
      .then(([colRes, prodRes]) => {
        setCollection(colRes.data)
        setProducts(prodRes.data)
      })
      .catch(() => navigate('/collections'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this collection?')) return
    try {
      await deleteCollection(id)
      toast.success('Collection deleted')
      navigate('/collections')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: '64px'
    }}>
      <p style={{
        fontSize: '11px', letterSpacing: '4px',
        color: 'var(--gray-mid)'
      }}>
        LOADING...
      </p>
    </div>
  )

  const bannerUrl = collection?.banner_image
    ? `${import.meta.env.VITE_API_URL}${collection.banner_image}`
    : null

  return (
    <div style={{ paddingTop: '64px' }}>

      {/* Banner */}
      <section style={{
        position: 'relative', height: '480px',
        overflow: 'hidden',
        background: 'var(--green-dark)'
      }}>
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={collection.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.5
            }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
        }} />

        {/* Breadcrumb */}
        <div style={{
          position: 'absolute', top: '32px', left: '6%',
          display: 'flex', gap: '8px', alignItems: 'center'
        }}>
          <span
            onClick={() => navigate('/')}
            style={{
              fontSize: '11px', letterSpacing: '2px',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
            }}
          >
            HOME
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>›</span>
          <span style={{
            fontSize: '11px', letterSpacing: '2px',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
          }}
            onClick={() => navigate('/collections')}
          >
            COLLECTIONS
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>›</span>
          <span style={{
            fontSize: '11px', letterSpacing: '2px',
            color: 'var(--white)'
          }}>
            {collection?.title?.toUpperCase()}
          </span>
        </div>

        {/* Collection info */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '6%'
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '4px',
            color: 'rgba(255,255,255,0.6)', marginBottom: '12px'
          }}>
            LUXURY COLLECTION
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            color: 'var(--white)', fontWeight: 300,
            marginBottom: '12px'
          }}>
            {collection?.title}
          </h1>
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.7)',
            maxWidth: '480px', lineHeight: 1.7
          }}>
            {collection?.description}
          </p>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div style={{
            position: 'absolute', bottom: '40px', right: '6%',
            display: 'flex', gap: '12px'
          }}>
            <button
              onClick={() => navigate(`/admin/edit-collection/${id}`)}
              style={{
                padding: '10px 24px', borderRadius: '50px',
                border: '1.5px solid rgba(255,255,255,0.6)',
                background: 'transparent', color: 'var(--white)',
                fontSize: '11px', letterSpacing: '2px'
              }}
            >
              EDIT
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '10px 24px', borderRadius: '50px',
                border: 'none', background: '#e74c3c',
                color: 'var(--white)', fontSize: '11px', letterSpacing: '2px'
              }}
            >
              DELETE
            </button>
          </div>
        )}
      </section>

      {/* Products */}
      <section style={{ padding: '72px 6%' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '48px'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '36px', fontWeight: 300
          }}>
            {products.length} Piece{products.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '24px',
              fontWeight: 300, color: 'var(--gray-mid)'
            }}>
              No products in this collection yet
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}