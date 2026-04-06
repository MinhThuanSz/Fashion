import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.'
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }

    if (error.code === 'ECONNABORTED') {
      toast.error('Kết nối quá chậm! Vui lòng kiểm tra mạng.', { id: 'network-error' })
    }
    // Don't auto-toast here — let callers handle it for flexibility
    return Promise.reject(error)
  }
)

// ── Products ──────────────────────────────────────────────
export const productsApi = {
  getAll:  (params) => api.get('/products', { params }),
  getById: (id)     => api.get(`/products/${id}`),
  create:  (data)   => api.post('/products', data),
  update:  (id, data) => api.put(`/products/${id}`, data),
  delete:  (id)     => api.delete(`/products/${id}`),
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login:         (credentials) => api.post('/auth/login', credentials),
  register:      (userData)    => api.post('/auth/register', userData),
  getProfile:    ()            => api.get('/auth/profile'),
  updateProfile: (data)        => api.put('/auth/profile', data),
  uploadAvatar:  (data)        => api.post('/auth/avatar', data),
}

// ── Orders ────────────────────────────────────────────────
export const ordersApi = {
  getAll:       (params)            => api.get('/orders', { params }),
  getMyOrders:  ()                  => api.get('/orders/my-orders'),
  getById:      (id)                => api.get(`/orders/${id}`),
  create:       (data)              => api.post('/orders', data),
  updateStatus: (id, status, paymentStatus) =>
    api.put(`/orders/${id}/status`, { status, payment_status: paymentStatus }),
}

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  getAll:      ()         => api.get('/users'),
  getById:     (id)       => api.get(`/users/${id}`),
  updateRole:  (id, role_id) => api.put(`/users/${id}/role`, { role_id }),
  updateStatus:(id, status)  => api.put(`/users/${id}/status`, { status }),
}

// ── Roles ─────────────────────────────────────────────────
export const rolesApi = {
  getAll: () => api.get('/roles'),
}

// ── Brands ────────────────────────────────────────────────
export const brandsApi = {
  getAll:  ()           => api.get('/brands'),
  getById: (id)         => api.get(`/brands/${id}`),
  create:  (data)       => api.post('/brands', data),
  update:  (id, data)   => api.put(`/brands/${id}`, data),
  delete:  (id)         => api.delete(`/brands/${id}`),
}

// ── Categories ────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
}

// ── Admin Dashboard ───────────────────────────────────────
export const adminApi = {
  getSummary:       () => api.get('/dashboard/summary'),
  getRevenueByDay:  () => api.get('/dashboard/revenue-by-day'),
  getRevenueByMonth:() => api.get('/dashboard/revenue-by-month'),
}

export default api
