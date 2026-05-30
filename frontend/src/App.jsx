import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import AddProduct from './pages/admin/AddProduct'
import AddCollection from './pages/admin/AddCollection'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.5px'
            }
          }}
        />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Logged in users */}
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/add-product" element={
            <AdminRoute><AddProduct /></AdminRoute>
          } />
          <Route path="/admin/add-collection" element={
            <AdminRoute><AddCollection /></AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', paddingTop: '64px',
              background: 'var(--cream)'
            }}>
              <p style={{
                fontSize: '11px', letterSpacing: '4px',
                color: 'var(--gray-mid)', marginBottom: '16px'
              }}>
                404
              </p>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: '56px',
                fontWeight: 300, marginBottom: '24px'
              }}>
                Page Not Found
              </h1>
              <a href="/" style={{
                fontSize: '11px', letterSpacing: '3px',
                fontWeight: 600, borderBottom: '1px solid var(--black)',
                paddingBottom: '4px'
              }}>
                BACK TO HOME
              </a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}