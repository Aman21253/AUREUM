import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSingleProduct, deleteProduct } from '../api/productsAPI'
import { createOrder } from '../api/paymentAPI'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, isLoggedIn } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  })

  useEffect(() => {
    getSingleProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/collections'))
      .finally(() => setLoading(false))
  }, [id])

  const sizes = product?.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const colors = product?.colors
    ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
    : []

  const imageUrl = product?.main_image
    ? `${import.meta.env.VITE_API_URL}${product.main_image}`
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }
    const existing = cartItems.find(i => i.id === product.id)
    let updated
    if (existing) {
      updated = cartItems.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      )
    } else {
      updated = [...cartItems, {
        id: product.id,
        title: product.title,
        price: product.discount_price || product.price,
        main_image: product.main_image,
        qty: 1,
        size: selectedSize,
        color: selectedColor
      }]
    }
    localStorage.setItem('cart', JSON.stringify(updated))
    setCartItems(updated)
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const exists = wishlist.find(i => i.id === product.id)
    if (exists) {
      toast('Already in wishlist')
      return
    }
    wishlist.push(product)
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    toast.success('Added to wishlist!')
  }

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    try {
      const amount = product.discount_price || product.price
      const res = await createOrder(amount)
      const { order, key } = res.data

      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'AUREUM',
        description: product.title,
        order_id: order.id,
        handler: () => {
          toast.success('Payment successful!')
        },
        theme: { color: '#0a0a0a' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      toast.error('Payment failed')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
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

  const hasDiscount = product?.discount_price &&
    product.discount_price < product.price

  return (
    <div style={{ paddingTop: '64px' }}>
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 64px)', padding: '60px 6%',
        gap: '72px', alignItems: 'start'
      }}>

        {/* Image */}
        <div style={{
          borderRadius: '20px', overflow: 'hidden',
          position: 'sticky', top: '84px'
        }}>
          <img
            src={imageUrl}
            alt={product?.title}
            style={{
              width: '100%', height: '600px',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Info */}
        <div>
          {product?.brand && (
            <p style={{
              fontSize: '11px', letterSpacing: '3px',
              color: 'var(--gray-mid)', marginBottom: '8px'
            }}>
              {product.brand.toUpperCase()}
            </p>
          )}

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 300, marginBottom: '16px', lineHeight: 1.2
          }}>
            {product?.title}
          </h1>

          {/* Price */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '24px'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 600 }}>
              ₹{hasDiscount ? product.discount_price : product?.price}
            </span>
            {hasDiscount && (
              <span style={{
                fontSize: '18px', color: 'var(--gray-mid)',
                textDecoration: 'line-through'
              }}>
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Description */}
          {product?.description && (
            <p style={{
              fontSize: '14px', color: 'var(--gray-dark)',
              lineHeight: 1.9, marginBottom: '32px'
            }}>
              {product.description}
            </p>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '11px', letterSpacing: '2px',
                color: 'var(--gray-mid)', marginBottom: '12px'
              }}>
                SIZE
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '8px 20px', borderRadius: '50px',
                      border: selectedSize === s
                        ? '2px solid var(--black)'
                        : '1.5px solid #ddd',
                      background: selectedSize === s
                        ? 'var(--black)' : 'transparent',
                      color: selectedSize === s
                        ? 'var(--white)' : 'var(--black)',
                      fontSize: '12px', letterSpacing: '1px'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontSize: '11px', letterSpacing: '2px',
                color: 'var(--gray-mid)', marginBottom: '12px'
              }}>
                COLOR
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: '8px 20px', borderRadius: '50px',
                      border: selectedColor === c
                        ? '2px solid var(--black)'
                        : '1.5px solid #ddd',
                      background: selectedColor === c
                        ? 'var(--black)' : 'transparent',
                      color: selectedColor === c
                        ? 'var(--white)' : 'var(--black)',
                      fontSize: '12px', letterSpacing: '1px'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p style={{
            fontSize: '12px', color: product?.stock > 0
              ? '#2d6a4f' : '#e74c3c',
            marginBottom: '32px', letterSpacing: '1px'
          }}>
            {product?.stock > 0
              ? `✓ In Stock (${product.stock} left)`
              : '✗ Out of Stock'}
          </p>

          {/* Action buttons */}
          {!isAdmin && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: '12px', marginBottom: '24px'
            }}>
              <button
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
                style={{
                  padding: '16px', borderRadius: '50px',
                  border: '1.5px solid var(--black)',
                  background: 'transparent', color: 'var(--black)',
                  fontSize: '11px', letterSpacing: '3px', fontWeight: 600,
                  opacity: product?.stock === 0 ? 0.4 : 1
                }}
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product?.stock === 0}
                style={{
                  padding: '16px', borderRadius: '50px',
                  border: 'none', background: 'var(--black)',
                  color: 'var(--white)', fontSize: '11px',
                  letterSpacing: '3px', fontWeight: 600,
                  opacity: product?.stock === 0 ? 0.4 : 1
                }}
              >
                BUY NOW
              </button>
              <button
                onClick={handleAddToWishlist}
                style={{
                  padding: '16px', borderRadius: '50px',
                  border: '1.5px solid #ddd',
                  background: 'transparent', color: 'var(--gray-dark)',
                  fontSize: '11px', letterSpacing: '3px', fontWeight: 600
                }}
              >
                ♡ ADD TO WISHLIST
              </button>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate(`/admin/edit-product/${id}`)}
                style={{
                  padding: '14px 32px', borderRadius: '50px',
                  border: '1.5px solid var(--black)',
                  background: 'transparent', color: 'var(--black)',
                  fontSize: '11px', letterSpacing: '2px'
                }}
              >
                EDIT PRODUCT
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '14px 32px', borderRadius: '50px',
                  border: 'none', background: '#e74c3c',
                  color: 'var(--white)', fontSize: '11px', letterSpacing: '2px'
                }}
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}