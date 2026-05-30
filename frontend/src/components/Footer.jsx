export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)', color: 'var(--white)',
      padding: '48px', textAlign: 'center'
    }}>
      <p style={{
        fontFamily: 'var(--font-serif)', fontSize: '28px',
        letterSpacing: '8px', marginBottom: '16px'
      }}>
        AUREUM
      </p>
      <p style={{
        fontSize: '11px', letterSpacing: '2px',
        color: 'rgba(255,255,255,0.4)'
      }}>
        © 2026 AUREUM. LUXURY FASHION.
      </p>
    </footer>
  )
}