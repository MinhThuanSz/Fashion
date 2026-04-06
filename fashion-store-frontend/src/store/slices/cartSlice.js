import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // payload: { id, product_variant_id, name, unit_price, price, image, size, color, quantity, subtotal, stock }
      // Normalize to use unit_price and product_variant_id consistently
      const price = action.payload.unit_price || action.payload.price || 0
      const variantId = action.payload.product_variant_id || action.payload.variantId || action.payload.id
      
      const normalizedItem = {
        ...action.payload,
        product_variant_id: variantId,
        unit_price: price,
        price: price, // Keep both for backward compat
        subtotal: action.payload.subtotal || (price * action.payload.quantity)
      }
      
      const { id, size, color, quantity } = normalizedItem
      const existingIndex = state.items.findIndex(
        (item) => item.id === id && item.size === size && item.color === color
      )

      if (existingIndex >= 0) {
        // Item already exists, increase qty
        const newQuantity = Math.min(
          state.items[existingIndex].quantity + quantity,
          state.items[existingIndex].stock || 999
        )
        state.items[existingIndex].quantity = newQuantity
        state.items[existingIndex].subtotal = state.items[existingIndex].unit_price * newQuantity
      } else {
        // New item
        state.items.push(normalizedItem)
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      )
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
        item.subtotal = item.unit_price * item.quantity
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cartItems')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
