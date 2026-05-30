import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const imageUrl = product.main_image
    ? `http://localhost:8000${product.main_image}`
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'

  const hasDiscount = product.discount_price && product.discount_price < product.price

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        cursor: 'pointer', borderRadius: '12px',
        overflow: 'hidden', background: 'var(--white)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {hasDiscount && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'var(--black)', color: 'var(--white)',
            fontSize: '10px', letterSpacing: '1px',
            padding: '4px 10px', borderRadius: '4px'
          }}>
            SALE
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        {product.brand && (
          <p style={{
            fontSize: '10px', letterSpacing: '2px',
            color: 'var(--gray-mid)', marginBottom: '4px'
          }}>
            {product.brand.toUpperCase()}
          </p>
        )}
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '18px',
          fontWeight: 400, marginBottom: '8px'
        }}>
          {product.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasDiscount ? (
            <>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                ₹{product.discount_price}
              </span>
              <span style={{
                fontSize: '13px', color: 'var(--gray-mid)',
                textDecoration: 'line-through'
              }}>
                ₹{product.price}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '16px', fontWeight: 600 }}>
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}