import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/paymentAPI'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    const updated = cart.map(i => i.id === id ? { ...i, qty } : i)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = (id) => {
    const updated = cart.filter(i => i.id !== id)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    toast.success('Removed from cart')
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const handleCheckout = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    try {
      const res = await createOrder(total)
      const { order, key } = res.data
      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'AUREUM',
        description: 'Order Payment',
        order_id: order.id,
        handler: () => {
          localStorage.removeItem('cart')
          setCart([])
          toast.success('Order placed successfully!')
          navigate('/')
        },
        theme: { color: '#0a0a0a' }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      toast.error('Checkout failed')
    }
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--cream)' }}>
      <section style={{ padding: '60px 6%', maxWidth: '1100px', margin: '0 auto' }}>

        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 300, marginBottom: '48px'
        }}>
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div style={{
            background: 'var(--white)', borderRadius: '20px',
            padding: '80px 40px', textAlign: 'center'
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--black)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 24px'
            }}>
              🛍
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '32px',
              fontWeight: 300, marginBottom: '12px'
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '14px', color: 'var(--gray-mid)',
              marginBottom: '32px', lineHeight: 1.7
            }}>
              Discover timeless luxury fashion pieces crafted for elegance and modern couture.
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => {
                const imageUrl = item.main_image
                  ? `http://localhost:8000${item.main_image}`
                  : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'
                return (
                  <div key={item.id} style={{
                    background: 'var(--white)', borderRadius: '16px',
                    padding: '20px', display: 'flex',
                    gap: '20px', alignItems: 'center'
                  }}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      style={{
                        width: '90px', height: '110px',
                        objectFit: 'cover', borderRadius: '10px',
                        cursor: 'pointer', flexShrink: 0
                      }}
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '20px', fontWeight: 400, marginBottom: '4px'
                      }}>
                        {item.title}
                      </h3>
                      {item.size && (
                        <p style={{ fontSize: '12px', color: 'var(--gray-mid)', marginBottom: '2px' }}>
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p style={{ fontSize: '12px', color: 'var(--gray-mid)', marginBottom: '8px' }}>
                          Color: {item.color}
                        </p>
                      )}
                      <p style={{ fontSize: '16px', fontWeight: 600 }}>
                        ₹{item.price}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        border: '1.5px solid #eee', borderRadius: '50px',
                        padding: '4px 12px'
                      }}>
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          style={{
                            background: 'none', border: 'none',
                            fontSize: '18px', cursor: 'pointer',
                            color: 'var(--black)', lineHeight: 1
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{
                            background: 'none', border: 'none',
                            fontSize: '18px', cursor: 'pointer',
                            color: 'var(--black)', lineHeight: 1
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'none', border: 'none',
                          fontSize: '11px', letterSpacing: '1px',
                          color: '#e74c3c', cursor: 'pointer'
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div style={{
              background: 'var(--white)', borderRadius: '20px',
              padding: '32px', position: 'sticky', top: '84px'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: '24px',
                fontWeight: 300, marginBottom: '24px'
              }}>
                Order Summary
              </h2>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '12px', fontSize: '14px', color: 'var(--gray-dark)'
              }}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '24px', fontSize: '14px', color: 'var(--gray-dark)'
              }}>
                <span>Shipping</span>
                <span style={{ color: '#2d6a4f' }}>FREE</span>
              </div>
              <div style={{
                borderTop: '1px solid #eee', paddingTop: '20px',
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '28px', fontSize: '18px', fontWeight: 600
              }}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '16px',
                  background: 'var(--black)', color: 'var(--white)',
                  border: 'none', borderRadius: '50px',
                  fontSize: '11px', letterSpacing: '3px', fontWeight: 600
                }}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}