import { useNavigate } from 'react-router-dom'

export default function CollectionCard({ collection }) {
  const navigate = useNavigate()
  const imageUrl = collection.banner_image
    ? `http://localhost:8000${collection.banner_image}`
    : 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600'

  return (
    <div
      onClick={() => navigate(`/collections/${collection.id}`)}
      style={{
        position: 'relative', borderRadius: '16px',
        overflow: 'hidden', cursor: 'pointer',
        height: '480px', background: '#111'
      }}
    >
      <img
        src={imageUrl}
        alt={collection.title}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.75,
          transition: 'transform 0.5s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '32px'
      }}>
        <p style={{
          fontSize: '10px', letterSpacing: '3px',
          color: 'rgba(255,255,255,0.7)', marginBottom: '8px'
        }}>
          LUXURY COLLECTION
        </p>
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '32px',
          color: 'var(--white)', fontWeight: 300, marginBottom: '8px'
        }}>
          {collection.title}
        </h3>
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.7)',
          marginBottom: '20px', lineHeight: 1.5
        }}>
          {collection.description}
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'var(--white)', fontSize: '11px', letterSpacing: '2px'
        }}>
          EXPLORE <span>→</span>
        </div>
      </div>
    </div>
  )
}