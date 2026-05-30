import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LogoutModal({ isOpen, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: '20px',
        padding: '48px 56px', maxWidth: '400px', width: '90%',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '11px', letterSpacing: '3px',
          color: 'var(--gray-mid)', marginBottom: '16px'
        }}>
          CONFIRM LOGOUT
        </p>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: '36px',
          fontWeight: 300, marginBottom: '16px'
        }}>
          Are you sure?
        </h2>
        <p style={{
          fontSize: '13px', color: 'var(--gray-dark)',
          lineHeight: 1.6, marginBottom: '36px'
        }}>
          You'll be logged out of your account and redirected to the homepage.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 32px', borderRadius: '50px',
              border: 'none', background: 'transparent',
              fontSize: '11px', letterSpacing: '2px', fontWeight: 500
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 32px', borderRadius: '50px',
              border: 'none', background: 'var(--black)',
              color: 'var(--white)', fontSize: '11px',
              letterSpacing: '2px', fontWeight: 500
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  )
}