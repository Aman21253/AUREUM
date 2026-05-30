import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'))
  }, [])

  const removeItem = (id) => {
    const updated = wishlist.filter(i => i.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    toast.success('Removed from wishlist')
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--cream)' }}>
      <section style={{ padding: '60px 6%', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 300, marginBottom: '48px'
        }}>
          Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div style={{
            background: 'var(--white)', borderRadius: '20px',
            padding: '80px 40px', textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px', marginBottom: '24px'
            }}>
              ♡
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '32px',
              fontWeight: 300, marginBottom: '12px'
            }}>
              Your wishlist is empty
            </h2>
            <p style={{
              fontSize: '14px', color: 'var(--gray-mid)',
              marginBottom: '32px'
            }}>
              Save pieces you love and come back to them anytime.
            </p>
            <button
              onClick={() => navigate('/collections')}
              style={{
                padding: '14px 36px', borderRadius: '50px',
                border: 'none', background: 'var(--black)',
                color: 'var(--white)', fontSize: '11px',
                letterSpacing: '3px', fontWeight: 600
              }}
            >
              EXPLORE COLLECTIONS
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {wishlist.map(item => {
              const imageUrl = item.main_image
                ? `http://localhost:8000${item.main_image}`
                : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'
              return (
                <div key={item.id} style={{
                  background: 'var(--white)', borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      onClick={() => navigate(`/products/${item.id}`)}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', cursor: 'pointer'
                      }}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'var(--white)', border: 'none',
                        borderRadius: '50%', width: '36px', height: '36px',
                        fontSize: '16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)', fontSize: '20px',
                      fontWeight: 400, marginBottom: '8px'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                      ₹{item.discount_price || item.price}
                    </p>
                    <button
                      onClick={() => navigate(`/products/${item.id}`)}
                      style={{
                        width: '100%', padding: '12px',
                        background: 'var(--black)', color: 'var(--white)',
                        border: 'none', borderRadius: '50px',
                        fontSize: '11px', letterSpacing: '2px', fontWeight: 600
                      }}
                    >
                      VIEW PRODUCT
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}