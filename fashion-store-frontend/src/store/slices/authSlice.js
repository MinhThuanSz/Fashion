import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // API expects full_name, so we map name -> full_name if necessary, but the component sends name, password, email
      const dataToSend = { 
        email: userData.email, 
        password: userData.password, 
        full_name: userData.name || 'User' 
      }
      const response = await authApi.register(dataToSend)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        // action.payload contains id, full_name, email, role, token
        const { token, ...userData } = action.payload
        state.user = userData
        state.token = token
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        toast.success('Chào mừng quay lại NovaKit!', { 
          icon: '👋',
          style: { background: '#0ea5e9', color: '#fff', borderRadius: '1.5rem', fontWeight: 'black' }
        })
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        const { token, ...userData } = action.payload
        state.user = userData
        state.token = token
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        toast.success('Chào mừng bạn đến với NovaKit!', { 
          icon: '✨',
          style: { background: '#0ea5e9', color: '#fff', borderRadius: '1.5rem', fontWeight: 'black' }
        })
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, updateUser } = authSlice.actions
export default authSlice.reducer

