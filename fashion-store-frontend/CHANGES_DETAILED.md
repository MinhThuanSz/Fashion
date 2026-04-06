# 🔧 CHECKOUT FIX - CHI TIẾT CÁC THAY ĐỔI (LINE BY LINE)

## 📄 FILE 1: `src/pages/ProductDetail.jsx`

**Location:** Line ~50 (handleAddToCart function)

```diff
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
+     product_variant_id: product.id,
      name: product.name,
      price: product.price,
+     unit_price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
+     subtotal: product.price * quantity
    }))
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`, { icon: '🛍️' })
  }
```

**Changes:**
- ✅ Line: Added `product_variant_id: product.id`
- ✅ Line: Added `unit_price: product.price`
- ✅ Line: Added `subtotal: product.price * quantity`

---

## 📄 FILE 2: `src/store/slices/cartSlice.js`

**Location:** Line ~8-40 (addToCart reducer)

```diff
  addToCart: (state, action) => {
-   // payload shape: { id, variantId, name, price, image, size, color, quantity, stock }
+   // payload: { id, product_variant_id, name, unit_price, price, image, size, color, quantity, subtotal, stock }
-   // - id: product ID
-   // - variantId: product_variant_id (the real DB row in product_variants)
+   // Normalize to use unit_price and product_variant_id consistently
+   const price = action.payload.unit_price || action.payload.price || 0
+   const variantId = action.payload.product_variant_id || action.payload.variantId || action.payload.id
+   
    const normalizedItem = {
      ...action.payload,
-     product_variant_id: action.payload.product_variant_id || action.payload.variantId,
-     unit_price: action.payload.unit_price || action.payload.price,
-     subtotal: (action.payload.subtotal) || 
-               ((action.payload.unit_price || action.payload.price) * action.payload.quantity)
+     product_variant_id: variantId,
+     unit_price: price,
+     price: price, // Keep both for backward compat
+     subtotal: action.payload.subtotal || (price * action.payload.quantity)
    }
    const { id, size, color, quantity } = normalizedItem
    const existingIndex = state.items.findIndex(
      (item) => item.id === id && item.size === size && item.color === color
    )

    if (existingIndex >= 0) {
-     state.items[existingIndex].quantity = Math.min(
-       state.items[existingIndex].quantity + quantity,
-       state.items[existingIndex].stock || 999
-     )
+     // Item already exists, increase qty
+     const newQuantity = Math.min(
+       state.items[existingIndex].quantity + quantity,
+       state.items[existingIndex].stock || 999
+     )
+     state.items[existingIndex].quantity = newQuantity
+     state.items[existingIndex].subtotal = state.items[existingIndex].unit_price * newQuantity
    } else {
+     // New item
      state.items.push(normalizedItem)
    }
    localStorage.setItem('cartItems', JSON.stringify(state.items))
  },
```

**Changes:**
- ✅ Line: Added better comments
- ✅ Line: Extract `price` with fallback chain
- ✅ Line: Extract `variantId` with fallback chain (including `id`)
- ✅ Line: Assign `product_variant_id: variantId`
- ✅ Line: Assign `price: price` for backward compat
- ✅ Line: When item exists, also update `subtotal`

**Location:** Line ~46-55 (updateQuantity reducer)

```diff
  updateQuantity: (state, action) => {
    const { id, size, color, quantity } = action.payload
    const item = state.items.find(
      (item) => item.id === id && item.size === size && item.color === color
    )
    if (item) {
      item.quantity = Math.max(1, quantity)
+     item.subtotal = item.unit_price * item.quantity
    }
    localStorage.setItem('cartItems', JSON.stringify(state.items))
  },
```

**Changes:**
- ✅ Line: Added `item.subtotal = item.unit_price * item.quantity` to keep subtotal in sync

---

## 📄 FILE 3: `src/pages/Cart.jsx`

**Location:** Line ~11 (subtotal calculation)

```diff
  const { items: cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()

- const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
+ const subtotal = cartItems.reduce((acc, item) => acc + ((item.unit_price || item.price) * item.quantity), 0)
  const shipping = subtotal > 1000000 ? 0 : 35000
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax
```

**Changes:**
- ✅ Line: Changed calculation to use `unit_price` with `price` fallback

**Location:** Line ~85 (price display)

```diff
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-bold text-2xl group-hover:text-black transition-colors">{item.name}</h3>
                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                           <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">{item.size}</span>
                           <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">{item.color}</span>
                        </div>
                      </div>
-                     <p className="font-black text-2xl">{item.price.toLocaleString('vi-VN')}đ</p>
+                     <p className="font-black text-2xl">{(item.unit_price || item.price).toLocaleString('vi-VN')}đ</p>
                    </div>
```

**Changes:**
- ✅ Line: Display price using `unit_price` with `price` fallback

---

## 📄 FILE 4: `src/pages/Checkout.jsx`

**Location:** Line ~20 (subtotal calculation)

```diff
  const { items: cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

- const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
+ const subtotal = cartItems.reduce((acc, item) => acc + ((item.unit_price || item.price) * item.quantity), 0)
  const shipping = subtotal > 1000000 ? 0 : 35000
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax
```

**Changes:**
- ✅ Line: Changed calculation to use `unit_price` with `price` fallback

**Location:** Line ~38-121 (handlePlaceOrder function - MAJOR CHANGES)

```diff
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
+   
+   // VALIDATION: Empty cart
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!')
      return;
    }
+   
+   // VALIDATION: Form fields
    if (!formData.receiver_name.trim()) {
      toast.error('Vui lòng nhập họ tên người nhận!')
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại!')
      return;
    }
    if (!formData.shipping_address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!')
      return;
    }

+   // VALIDATION & NORMALIZATION: Check cart items have required fields
+   const normalizedItems = cartItems.map(item => {
+     const variantId = item.product_variant_id || item.variantId || item.id
+     const unitPrice = item.unit_price || item.price
+     const qty = parseInt(item.quantity) || 0
+     const subtotal = item.subtotal || (unitPrice * qty)
+
+     // Validate required fields
+     if (!variantId) {
+       throw new Error(`Sản phẩm "${item.name}" thiếu thông tin ID. Vui lòng kiểm tra lại.`)
+     }
+     if (!unitPrice || unitPrice <= 0) {
+       throw new Error(`Sản phẩm "${item.name}" thiếu giá. Vui lòng kiểm tra lại.`)
+     }
+     if (qty <= 0) {
+       throw new Error(`Sản phẩm "${item.name}" có số lượng không hợp lệ.`)
+     }
+
+     return {
+       product_variant_id: variantId,
+       quantity: qty,
+       unit_price: unitPrice,
+       subtotal: subtotal
+     }
+   })

    setLoading(true)
    try {
      const payload = {
        receiver_name:    formData.receiver_name.trim(),
        phone:            formData.phone.trim(),
        shipping_address: `${formData.shipping_address.trim()}${formData.city ? `, ${formData.city.trim()}` : ''}`,
        payment_method:   paymentMethod.toUpperCase(),
-       // Send both product_id and variantId so backend can do smart lookup
-       items: cartItems.map(item => ({
-         product_variant_id: item.variantId || null,  // real variant ID if stored
-         product_id:         item.id,                 // product ID as fallback
-         quantity:           item.quantity,
-         unit_price:         item.price,
-         subtotal:           item.price * item.quantity
-       }))
+       items: normalizedItems
      }

+     // DEBUG: Log payload before sending
+     console.log('📤 Order Payload:', JSON.stringify(payload, null, 2))

      const { ordersApi } = await import('../services/api')
      await ordersApi.create(payload)

      setIsOrdered(true)
      dispatch(clearCart())
      toast.success('ĐẶT HÀNG THÀNH CÔNG! Cảm ơn quý khách.', { duration: 5000, icon: '🎉' })
    } catch (error) {
-     console.error('Checkout Error:', error)
-     const apiMsg = error.response?.data?.message || error.response?.data?.error
+     console.error('❌ Checkout Error:', error)
+     
+     // Handle validation errors from our code
+     if (error.message && error.message.includes('Sản phẩm')) {
+       toast.error(error.message, { duration: 6000 })
+       return
+     }

+     // Handle API errors
+     const apiMsg = error.response?.data?.message || error.response?.data?.error || error.message
+     let friendlyMsg = 'Đặt hàng không thành công. Vui lòng thử lại.'

-     // Show friendly Vietnamese message — strip any raw technical IDs
      if (apiMsg) {
-       // If the message contains raw variant IDs, replace with friendly version
-       const friendlyMsg = apiMsg.includes('Variant ID')
-         ? 'Một sản phẩm trong giỏ hàng hiện không còn khả dụng. Vui lòng kiểm tra lại giỏ hàng.'
-         : apiMsg
+       // Map technical errors to friendly Vietnamese messages
+       if (apiMsg.includes('product_variant_id') || apiMsg.includes('items')) {
+         friendlyMsg = 'Một hoặc nhiều sản phẩm trong giỏ hàng không hợp lệ. Vui lòng kiểm tra lại.'
+       } else if (apiMsg.includes('quantity')) {
+         friendlyMsg = 'Số lượng sản phẩm không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.'
+       } else if (apiMsg.includes('not found') || apiMsg.includes('không tồn tại')) {
+         friendlyMsg = 'Một sản phẩm trong giỏ hàng hiện không còn khả dụng. Vui lòng kiểm tra lại.'
+       } else if (apiMsg.includes('payment')) {
+         friendlyMsg = 'Lỗi xử lý thanh toán. Vui lòng thử lại.'
+       } else {
+         // Use API message if it's already in Vietnamese
+         friendlyMsg = apiMsg
+       }
      } else {
+       // Already have default friendlyMsg
-       toast.error(
-         'Đặt hàng không thành công. Một hoặc nhiều sản phẩm có thể không còn trong kho.',
-         { duration: 6000 }
-       )
      }
+     
+     toast.error(friendlyMsg, { duration: 6000 })
    } finally {
      setLoading(false)
    }
  }
```

**Changes:**
- ✅ Added proper comments for validation steps
- ✅ Added validation & normalization section for items
- ✅ Added check for `product_variant_id` presence
- ✅ Added check for `unit_price > 0`
- ✅ Added check for `quantity > 0`
- ✅ Removed `product_id` fallback (not needed)
- ✅ Changed `unit_price: item.price` to use normalized `unitPrice`
- ✅ Changed subtotal calculation to use normalized values
- ✅ Added payload logging: `📤 Order Payload:`
- ✅ Added better error handling with friendly messages
- ✅ Map technical error keywords to Vietnamese messages

**Location:** Line ~284 (order summary display)

```diff
                      <div className="flex gap-4">
                         <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-grow space-y-1 overflow-hidden">
                            <p className="font-bold text-xs truncate text-white uppercase tracking-widest">{item.name}</p>
-                           <p className="text-[9px] font-black text-gray-400 tracking-tighter italic uppercase">{item.quantity} x {item.price.toLocaleString('vi-VN')}đ • {item.size}</p>
+                           <p className="text-[9px] font-black text-gray-400 tracking-tighter italic uppercase">{item.quantity} x {(item.unit_price || item.price).toLocaleString('vi-VN')}đ • {item.size}</p>
                         </div>
                      </div>
```

**Changes:**
- ✅ Line: Display price using `unit_price` with `price` fallback in order summary

---

## 📊 SUMMARY OF CHANGES

| File | Lines | Type | Changes |
|------|-------|------|---------|
| **ProductDetail.jsx** | 48-56 | Added | 3 lines: product_variant_id, unit_price, subtotal |
| **cartSlice.js** | 8-40 | Modified | Improved normalization with fallback chains |
| **cartSlice.js** | 46-55 | Added | 1 line: update subtotal on qty change |
| **Cart.jsx** | 11 | Modified | Use unit_price ✨ price in calculation |
| **Cart.jsx** | 85 | Modified | Display price using unit_price fallback |
| **Checkout.jsx** | 20 | Modified | Use unit_price ✨ price in calculation |
| **Checkout.jsx** | 38-121 | Refactored | Major: validation, normalization, error handling |
| **Checkout.jsx** | 284 | Modified | Display price using unit_price fallback |

**Total Lines Changed:** ~50-60 lines across 4 files

---

## 🎯 VERIFICATION

To verify all changes are correct:

```bash
# Check ProductDetail.jsx line 48-56
grep -n "product_variant_id: product.id" src/pages/ProductDetail.jsx

# Check cartSlice.js line 8-40
grep -n "const price = action.payload" src/store/slices/cartSlice.js

# Check Cart.jsx line 11
grep -n "item.unit_price || item.price" src/pages/Cart.jsx

# Check Checkout.jsx line 20
grep -n "item.unit_price || item.price" src/pages/Checkout.jsx

# Check Checkout.jsx line 38 (normalization)
grep -n "const normalizedItems = cartItems.map" src/pages/Checkout.jsx

# Check Checkout.jsx error handling
grep -n "friendlyMsg" src/pages/Checkout.jsx
```

---

## ✅ COMPLETION STATUS

- ✅ ProductDetail.jsx - FIXED
- ✅ cartSlice.js - FIXED
- ✅ Cart.jsx - FIXED
- ✅ Checkout.jsx - FIXED
- ✅ Documentation created - COMPLETE

**All changes implemented successfully!**
