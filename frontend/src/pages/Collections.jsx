import { useEffect, useState } from 'react'
import { getCollections } from '../api/collectionsAPI'
import CollectionCard from '../components/CollectionCard'
import Footer from '../components/Footer'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollections()
      .then(res => setCollections(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* Hero Banner */}
      <section style={{
        position: 'relative', height: '420px', overflow: 'hidden',
        background: 'var(--green-dark)'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1a3a2a 0%, #0d4a3a 100%)'
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%', display: 'flex',
          flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          padding: '0 24px'
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '6px',
            color: 'rgba(255,255,255,0.6)', marginBottom: '20px'
          }}>
            EDITORIAL FASHION
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(52px, 8vw, 96px)',
            color: 'var(--white)', fontWeight: 300,
            lineHeight: 1, marginBottom: '20px'
          }}>
            Collections
          </h1>
          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.6)',
            maxWidth: '480px', lineHeight: 1.8
          }}>
            Discover curated luxury collections inspired by timeless elegance
            and modern couture.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section style={{ padding: '72px 6%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '4px',
              color: 'var(--gray-mid)'
            }}>
              LOADING...
            </p>
          </div>
        ) : collections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '28px',
              fontWeight: 300, color: 'var(--gray-mid)'
            }}>
              No collections yet
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {collections.map(c => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}