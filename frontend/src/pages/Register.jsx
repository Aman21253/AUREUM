import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authAPI'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerUser(form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)', paddingTop: '64px'
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: '20px',
        padding: '56px 48px', width: '100%', maxWidth: '440px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
      }}>
        <p style={{
          fontSize: '11px', letterSpacing: '4px',
          color: 'var(--gray-mid)', textAlign: 'center', marginBottom: '8px'
        }}>
          JOIN AUREUM
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: '40px',
          fontWeight: 300, textAlign: 'center', marginBottom: '40px'
        }}>
          Create Account
        </h1>

        <form onSubmit={handleSubmit}>
          <Input
            label="FULL NAME"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
          <Input
            label="EMAIL"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
          <Input
            label="PASSWORD"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              background: 'var(--black)', color: 'var(--white)',
              border: 'none', borderRadius: '50px',
              fontSize: '11px', letterSpacing: '3px',
              fontWeight: 600, marginTop: '8px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '13px', color: 'var(--gray-mid)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--black)', fontWeight: 600,
            borderBottom: '1px solid var(--black)'
          }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

function Input({ label, name, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        fontSize: '10px', letterSpacing: '2px',
        color: 'var(--gray-mid)', display: 'block', marginBottom: '8px'
      }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{
          width: '100%', padding: '14px 16px',
          border: '1px solid #e0e0e0', borderRadius: '10px',
          fontSize: '14px', outline: 'none',
          fontFamily: 'var(--font-sans)',
          background: 'var(--gray-light)'
        }}
      />
    </div>
  )
}