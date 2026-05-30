import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeaturedProducts } from '../api/productsAPI'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400'
const LUXURY_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'

const TICKER_WORDS = ['Elegance', 'Couture', 'Prestige', 'Style', 'Luxury']

export default function Home() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [featured, setFeatured] = useState([])
  const tickerRef = useRef(null)

  useEffect(() => {
    getFeaturedProducts()
      .then(res => setFeatured(res.data))
      .catch(() => {})
  }, [])

  return (
    <div style={{ paddingTop: '64px' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        <img
          src={HERO_IMAGE}
          alt="hero"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top'
          }}
        />
        {/* dark overlay left side */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,30,20,0.85) 40%, transparent 75%)'
        }} />

        {/* Hero text */}
        <div style={{
          position: 'absolute', top: '50%', left: '6%',
          transform: 'translateY(-50%)'
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '6px',
            color: 'rgba(255,255,255,0.7)', marginBottom: '24px'
          }}>
            LUXURY FASHION 2026
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(72px, 10vw, 120px)',
            color: 'var(--white)', fontWeight: 300,
            lineHeight: 1, marginBottom: '28px', letterSpacing: '4px'
          }}>
            AUREUM
          </h1>
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.8, marginBottom: '40px', maxWidth: '380px'
          }}>
            Modern couture crafted for timeless elegance, individuality,
            and premium fashion experiences.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/collections')}
              style={{
                padding: '14px 32px', borderRadius: '50px',
                border: 'none', background: 'var(--white)',
                color: 'var(--black)', fontSize: '11px',
                letterSpacing: '2px', fontWeight: 600
              }}
            >
              EXPLORE COLLECTIONS
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '14px 32px', borderRadius: '50px',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  background: 'transparent', color: 'var(--white)',
                  fontSize: '11px', letterSpacing: '2px', fontWeight: 600
                }}
              >
                JOIN NOW
              </button>
            )}
          </div>
        </div>

        {/* Scroll hint */}
        <p style={{
          position: 'absolute', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '4px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          SCROLL
        </p>
      </section>

      {/* ── CRAFTED FOR LUXURY ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        minHeight: '600px', alignItems: 'center',
        padding: '80px 8%', gap: '80px'
      }}>
        <div>
          <p style={{
            fontSize: '11px', letterSpacing: '4px',
            color: 'var(--gray-mid)', marginBottom: '24px'
          }}>
            EDITORIAL FASHION
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 300, lineHeight: 1.2, marginBottom: '24px'
          }}>
            Crafted<br />
            <em>For Luxury</em>
          </h2>
          <p style={{
            fontSize: '14px', color: 'var(--gray-dark)',
            lineHeight: 1.9, marginBottom: '36px', maxWidth: '420px'
          }}>
            Every collection reflects premium craftsmanship, bold
            silhouettes, and contemporary elegance inspired by
            global fashion culture.
          </p>
          <button
            onClick={() => navigate('/collections')}
            style={{
              background: 'none', border: 'none',
              fontSize: '11px', letterSpacing: '3px',
              fontWeight: 600, display: 'flex',
              alignItems: 'center', gap: '8px',
              borderBottom: '1px solid var(--black)',
              paddingBottom: '4px'
            }}
          >
            VIEW ALL COLLECTIONS →
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <img
            src={LUXURY_IMAGE}
            alt="luxury"
            style={{
              width: '100%', height: '520px',
              objectFit: 'cover', borderRadius: '20px'
            }}
          />
          {/* Season badge */}
          <div style={{
            position: 'absolute', bottom: '24px', right: '-20px',
            background: 'var(--black)', color: 'var(--white)',
            padding: '16px 24px', borderRadius: '12px'
          }}>
            <p style={{
              fontSize: '10px', letterSpacing: '3px',
              color: 'rgba(255,255,255,0.5)', marginBottom: '4px'
            }}>
              SEASON
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '20px'
            }}>
              SS 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{
        background: 'var(--black)', overflow: 'hidden',
        padding: '18px 0', whiteSpace: 'nowrap'
      }}>
        <div
          ref={tickerRef}
          style={{
            display: 'inline-block',
            animation: 'ticker 20s linear infinite'
          }}
        >
          {[...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS].map((word, i) => (
            <span key={i} style={{
              fontSize: '13px', letterSpacing: '4px',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 32px'
            }}>
              {word} <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section style={{ padding: '80px 6%' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '4px',
              color: 'var(--gray-mid)', marginBottom: '12px'
            }}>
              HAND PICKED
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300
            }}>
              Featured Pieces
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}