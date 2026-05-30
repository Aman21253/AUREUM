import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoutModal from './LogoutModal'

export default function Navbar() {
  const { isLoggedIn, isAdmin } = useAuth()
  const [showLogout, setShowLogout] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        background: 'var(--white)', borderBottom: '1px solid #eee'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px', letterSpacing: '6px',
          fontWeight: 400, color: 'var(--black)'
        }}>
          AUREUM
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <NavLink to="/" label="HOME" active={isActive('/')} />
          <NavLink to="/collections" label="COLLECTIONS" active={isActive('/collections')} />

          {isLoggedIn && !isAdmin && (
            <NavLink to="/wishlist" label="WISHLIST" active={isActive('/wishlist')} />
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/add-product" label="ADD PRODUCT" active={isActive('/admin/add-product')} />
              <NavLink to="/admin/add-collection" label="ADD COLLECTION" active={isActive('/admin/add-collection')} />
            </>
          )}

          {!isLoggedIn && (
            <NavLink to="/login" label="LOGIN" active={isActive('/login')} />
          )}

          {/* Cart icon - only for logged in non-admin */}
          {isLoggedIn && !isAdmin && (
            <Link to="/cart" style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--black)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'white',
              fontSize: '16px'
            }}>
              🛍
            </Link>
          )}

          {/* Register or Logout */}
          {!isLoggedIn ? (
            <Link to="/register" style={{
              background: 'var(--black)', color: 'var(--white)',
              padding: '10px 24px', borderRadius: '50px',
              fontSize: '11px', letterSpacing: '2px', fontWeight: 500
            }}>
              REGISTER
            </Link>
          ) : (
            <button
              onClick={() => setShowLogout(true)}
              style={{
                background: 'var(--black)', color: 'var(--white)',
                padding: '10px 24px', borderRadius: '50px',
                fontSize: '11px', letterSpacing: '2px', fontWeight: 500,
                border: 'none'
              }}
            >
              LOGOUT
            </button>
          )}
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      fontSize: '11px', letterSpacing: '2px', fontWeight: 500,
      color: 'var(--black)', position: 'relative',
      paddingBottom: '4px',
      borderBottom: active ? '1.5px solid var(--black)' : '1.5px solid transparent'
    }}>
      {label}
    </Link>
  )
}