import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin Pages
import DashboardAdmin from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import UserManagement from './pages/admin/UserManagement'
import BrandManagement from './pages/admin/BrandManagement'
import SettingsAdmin from './pages/admin/Settings'
import RevenueAnalytics from './pages/admin/RevenueAnalytics'

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="auth" element={<Auth />} />
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
               <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="brands" element={<BrandManagement />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="categories" element={<div className="p-10 font-black text-4xl">CATEGORY PAGE</div>} />
          <Route path="analytics" element={<RevenueAnalytics />} />
        </Route>
      </Routes>

      {/* Persistence and Feedback Layers */}
      <Toaster 
         position="bottom-right"
         toastOptions={{
            duration: 4000,
            style: {
               borderRadius: '1.5rem',
               background: '#000',
               color: '#fff',
               fontSize: '14px',
               fontWeight: 'bold',
               padding: '16px 24px',
               boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }
         }}
      />
    </>
  )
}

export default App
