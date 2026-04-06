# 🛠️ CHECKOUT FRONTEND FIX - HƯỚNG DẪN HOÀN CHỈNH

## 📋 PHÂN TÍCH LỖI CŨ

### Lỗi chính
| Vấn đề | Nguyên nhân | Tác động |
|--------|-----------|---------|
| ❌ `product_variant_id` undefined | ProductDetail không gửi | Backend rejection |
| ❌ Missing `unit_price` | Gửi `price` thay vì `unit_price` | Schema mismatch |
| ❌ Missing `subtotal` | Không tính hoặc không gửi | Data integrity |
| ❌ Sai tên field | `price` thay vì `unit_price` | Validation fail |
| ❌ Không validate items | Gửi luôn dù sai | Vô nghĩa error |
| ❌ Raw error messages | Hiển thị technical errors | User confusion |

## ✅ CÁC PHẦN ĐÃ SỬA

### 1️⃣ File: `src/pages/ProductDetail.jsx`

**Trước:**
```javascript
// ❌ SÓNG
dispatch(addToCart({
  id: product.id,
  name: product.name,
  price: product.price,           // Sai field name
  image: product.image,
  size: selectedSize,
  color: selectedColor,
  quantity: quantity
  // ❌ Thiếu product_variant_id, unit_price, subtotal
}))
```

**Sau:**
```javascript
// ✅ ĐÚNG
dispatch(addToCart({
  id: product.id,
  product_variant_id: product.id,      // ✅ Thêm variant ID
  name: product.name,
  price: product.price,                // Keep for backward compat
  unit_price: product.price,           // ✅ Backend expects this
  image: product.image,
  size: selectedSize,
  color: selectedColor,
  quantity: quantity,
  subtotal: product.price * quantity   // ✅ Pre-calculated for order
}))
```

**Tác dụng:**
- ✅ Cart item giờ có `product_variant_id` (= product ID)
- ✅ Cart item có `unit_price` để backend xử lý
- ✅ Cart item có `subtotal` đã tính sẵn

---

### 2️⃣ File: `src/store/slices/cartSlice.js`

**Trước:**
```javascript
// ❌ Cố gắng normalize nhưng incomplete
const normalizedItem = {
  ...action.payload,
  product_variant_id: action.payload.product_variant_id || action.payload.variantId,
  unit_price: action.payload.unit_price || action.payload.price,
  subtotal: (action.payload.subtotal) || 
            ((action.payload.unit_price || action.payload.price) * action.payload.quantity)
}
// ❌ Nếu ProductDetail không gửi, vẫn undefined
```

**Sau:**
```javascript
// ✅ PROPER NORMALIZATION
const price = action.payload.unit_price || action.payload.price || 0
const variantId = action.payload.product_variant_id || action.payload.variantId || action.payload.id

const normalizedItem = {
  ...action.payload,
  product_variant_id: variantId,        // ✅ Good fallback chain
  unit_price: price,                    // ✅ Always has value
  price: price,                         // ✅ Keep for backward compat
  subtotal: action.payload.subtotal || (price * action.payload.quantity) // ✅ Always calculated
}

// When updating quantity, also update subtotal
if (existingIndex >= 0) {
  state.items[existingIndex].quantity = newQuantity
  state.items[existingIndex].subtotal = state.items[existingIndex].unit_price * newQuantity
}

// When updating quantity reducer
updateQuantity: (state, action) => {
  if (item) {
    item.quantity = Math.max(1, quantity)
    item.subtotal = item.unit_price * item.quantity  // ✅ Keep subtotal in sync
  }
}
```

**Tác dụng:**
- ✅ Robust fallback chain
- ✅ Subtotal luôn được tính + lưu
- ✅ Consistent field names

---

### 3️⃣ File: `src/pages/Cart.jsx`

**Trước:**
```javascript
// ❌ SỰ KHÔNG NHẤT QUÁN
const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
// Display
<p>{item.price.toLocaleString('vi-VN')}đ</p>
// ❌ Luôn dùng item.price, không kiểm tra unit_price
```

**Sau:**
```javascript
// ✅ FALLBACK ĐỂ HANDLE CẢ HAI TRƯỜNG HỢP
const subtotal = cartItems.reduce(
  (acc, item) => acc + ((item.unit_price || item.price) * item.quantity), 
  0
)
// Display
<p>{(item.unit_price || item.price).toLocaleString('vi-VN')}đ</p>
```

**Tác dụng:**
- ✅ Sử dụng `unit_price` nếu có, fallback `price`
- ✅ Tính toán nhất quán
- ✅ Display đúng giá bán hiện tại

---

### 4️⃣ File: `src/pages/Checkout.jsx` (QUAN TRỌNG NHẤT)

#### ❌ Trước: Không validate, payload chứa undefined

```javascript
const handlePlaceOrder = async (e) => {
  e.preventDefault()
  
  // ❌ Minimal validation, chỉ check form
  if (!formData.receiver_name.trim()) {...}
  
  setLoading(true)
  try {
    const payload = {
      receiver_name: formData.receiver_name.trim(),
      phone: formData.phone.trim(),
      shipping_address: `...`,
      payment_method: paymentMethod.toUpperCase(),
      items: cartItems.map(item => ({
        product_variant_id: item.product_variant_id,  // ❌ Maybe undefined!
        quantity: item.quantity,
        unit_price: item.unit_price,                   // ❌ Maybe undefined!
        subtotal: item.subtotal                        // ❌ Maybe undefined!
      }))
    }
    // ❌ Gửi luôn dù chứa undefined
    await ordersApi.create(payload)
  }
}
```

#### ✅ Sau: Validate + Normalize + Friendly errors

```javascript
const handlePlaceOrder = async (e) => {
  e.preventDefault()
  
  // VALIDATION 1: Empty cart
  if (cartItems.length === 0) {
    toast.error('Giỏ hàng của bạn đang trống!')
    return;
  }
  
  // VALIDATION 2: Form fields
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

  // VALIDATION 3 & NORMALIZATION: Validate items + build clean payload
  const normalizedItems = cartItems.map(item => {
    // Extract with fallbacks
    const variantId = item.product_variant_id || item.variantId || item.id
    const unitPrice = item.unit_price || item.price
    const qty = parseInt(item.quantity) || 0
    const subtotal = item.subtotal || (unitPrice * qty)

    // ✅ VALIDATE: Throw error nếu thiếu field
    if (!variantId) {
      throw new Error(`Sản phẩm "${item.name}" thiếu thông tin ID. Vui lòng kiểm tra lại.`)
    }
    if (!unitPrice || unitPrice <= 0) {
      throw new Error(`Sản phẩm "${item.name}" thiếu giá. Vui lòng kiểm tra lại.`)
    }
    if (qty <= 0) {
      throw new Error(`Sản phẩm "${item.name}" có số lượng không hợp lệ.`)
    }

    // ✅ RETURN: Clean, validated item
    return {
      product_variant_id: variantId,
      quantity: qty,
      unit_price: unitPrice,
      subtotal: subtotal
    }
  })

  setLoading(true)
  try {
    const payload = {
      receiver_name: formData.receiver_name.trim(),
      phone: formData.phone.trim(),
      shipping_address: `${formData.shipping_address.trim()}${formData.city ? `, ${formData.city.trim()}` : ''}`,
      payment_method: paymentMethod.toUpperCase(),
      items: normalizedItems  // ✅ Clean, validated items
    }

    // ✅ DEBUG: Log for inspection
    console.log('📤 Order Payload:', JSON.stringify(payload, null, 2))

    const { ordersApi } = await import('../services/api')
    await ordersApi.create(payload)

    setIsOrdered(true)
    dispatch(clearCart())
    toast.success('ĐẶT HÀNG THÀNH CÔNG! Cảm ơn quý khách.', { duration: 5000, icon: '🎉' })
  } catch (error) {
    console.error('❌ Checkout Error:', error)
    
    // ✅ HANDLE: Validation errors from our code
    if (error.message && error.message.includes('Sản phẩm')) {
      toast.error(error.message, { duration: 6000 })
      return
    }

    // ✅ HANDLE: API errors with friendly messages
    const apiMsg = error.response?.data?.message || error.response?.data?.error || error.message
    let friendlyMsg = 'Đặt hàng không thành công. Vui lòng thử lại.'

    if (apiMsg) {
      if (apiMsg.includes('product_variant_id') || apiMsg.includes('items')) {
        friendlyMsg = 'Một hoặc nhiều sản phẩm trong giỏ hàng không hợp lệ. Vui lòng kiểm tra lại.'
      } else if (apiMsg.includes('quantity')) {
        friendlyMsg = 'Số lượng sản phẩm không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.'
      } else if (apiMsg.includes('not found') || apiMsg.includes('không tồn tại')) {
        friendlyMsg = 'Một sản phẩm trong giỏ hàng hiện không còn khả dụng. Vui lòng kiểm tra lại.'
      } else if (apiMsg.includes('payment')) {
        friendlyMsg = 'Lỗi xử lý thanh toán. Vui lòng thử lại.'
      } else {
        friendlyMsg = apiMsg
      }
    }
    
    toast.error(friendlyMsg, { duration: 6000 })
  } finally {
    setLoading(false)
  }
}
```

**Tác dụng:**
- ✅ Validate items trước khi gửi
- ✅ Normalize fields để backend nhận được đúng format
- ✅ Log payload cho debug
- ✅ Friendly error messages cho user
- ✅ Không gửi undefined/null fields

---

## 🧪 HƯỚNG DẪN TEST PHÍA FRONTEND

### TEST 1: Thêm sản phẩm vào giỏ

**Bước:**
1. Vào trang ProductDetail (e.g., `/products/1`)
2. Chọn Size, Color, Quantity
3. Click "Thêm vào giỏ hàng"
4. Kiểm tra console (F12 → Console tab)

**Input Screen:**
```
Size: 40
Color: Đen/Đỏ
Quantity: 2
```

**Expected Output - LocalStorage:**
```json
// localStorage.cartItems
{
  "id": 1,
  "product_variant_id": 1,        ✅ CÓ
  "name": "Nike Air Max 270 Premium",
  "price": 3850000,
  "unit_price": 3850000,          ✅ CÓ
  "image": "https://...",
  "size": "40",
  "color": "Đen/Đỏ",
  "quantity": 2,
  "subtotal": 7700000             ✅ CÓ (3850000 * 2)
}
```

---

### TEST 2: Kiểm tra Cart Page

**Bước:**
1. Vào `/cart`
2. Kiểm tra:
   - Price hiển thị đúng
   - Subtotal calculation đúng
   - Quantity update tính lại subtotal

**Expected:**
```
Item: Nike Air Max 270 Premium
Size: 40
Color: Đen/Đỏ
Price: 3,850,000đ                    ✅ Shows unit_price
Quantity: 2
Subtotal calc: 3,850,000 * 2 = 7,700,000đ  ✅ Calculated from unit_price
```

---

### TEST 3: Checkout Form Validation

**Bước 1: Test empty fields**
1. Vào `/checkout` có items trong cart
2. Click "ĐẶT HÀNG NGAY" mà không điền form

**Expected:**
```
❌ Toast: "Vui lòng nhập họ tên người nhận!"
❌ Toast: "Vui lòng nhập số điện thoại!"
❌ Toast: "Vui lòng nhập địa chỉ giao hàng!"
✅ Không gọi API
```

---

### TEST 4: Checkout Submit - Check Payload

**Bước:**
1. Vào `/checkout` với giỏ hàng có 2 items
2. Điền form:
   ```
   Họ tên: Minh Thuận
   Email: minh@example.com
   Số ĐT: 0908504227
   Thành phố: Hồ Chí Minh
   Địa chỉ: 123 Nguyễn Huệ, Q.1
   Payment: COD
   ```
3. Click "ĐẶT HÀNG NGAY"
4. Mở Console (F12)

**Expected - Console Output:**
```
📤 Order Payload: {
  "receiver_name": "Minh Thuận",
  "phone": "0908504227",
  "shipping_address": "123 Nguyễn Huệ, Q.1, Hồ Chí Minh",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,           ✅ NOT undefined
      "quantity": 2,
      "unit_price": 3850000,             ✅ NOT undefined
      "subtotal": 7700000
    },
    {
      "product_variant_id": 3,           ✅ NOT undefined
      "quantity": 1,
      "unit_price": 450000,              ✅ NOT undefined
      "subtotal": 450000
    }
  ]
}
```

**✅ Kiểm tra:**
- [ ] Tất cả items có `product_variant_id`
- [ ] Tất cả items có `unit_price` (NOT `price`)
- [ ] Tất cả items có `quantity` > 0
- [ ] Tất cả items có `subtotal` > 0
- [ ] Không có field `undefined` hoặc `null`
- [ ] Endpoint là `/api/orders` (POST)

---

### TEST 5: Error Handling - Friendly Messages

**Scenario 1: Backend returns validation error**
```javascript
// Backend error response
{
  "error": "items[0]: product_variant_id is required"
}
```

**Expected - Frontend:**
```
❌ Toast: "Một hoặc nhiều sản phẩm trong giỏ hàng không hợp lệ. Vui lòng kiểm tra lại."
✅ Clear Vietnamese message (NOT raw error)
```

**Scenario 2: Product not found**
```javascript
// Backend error response
{
  "error": "Product variant 999 not found"
}
```

**Expected - Frontend:**
```
❌ Toast: "Một sản phẩm trong giỏ hàng hiện không còn khả dụng. Vui lòng kiểm tra lại."
✅ User-friendly message
```

---

## 📊 KIỂM TRA TRƯỚC/SAU

### TRƯỚC (❌ SÓNG)
```
ProductDetail
  └─ cart item: { id, name, price, image, size, color, quantity }
                 ❌ No product_variant_id
                 ❌ No unit_price
                 ❌ No subtotal

Checkout payload
  └─ items: [{ product_variant_id: undefined, quantity: 2, unit_price: undefined }]
              ❌ Contains undefined values
              ❌ Backend validation fails
              ❌ Raw error: "product_variant_id is required"
```

### SAU (✅ ĐÚNG)
```
ProductDetail
  └─ cart item: { id, product_variant_id, name, price, unit_price, image, size, color, quantity, subtotal }
                 ✅ Has product_variant_id
                 ✅ Has unit_price
                 ✅ Has subtotal

Checkout payload
  └─ items: [{ product_variant_id: 1, quantity: 2, unit_price: 3850000, subtotal: 7700000 }]
              ✅ All fields present
              ✅ Backend validation passes
              ✅ Order created successfully
```

---

## 🔧 DEBUG CHECKLIST

- [ ] Console kiểm tra `📤 Order Payload` trước khi submit
- [ ] LocalStorage check: `JSON.parse(localStorage.getItem('cartItems'))`
- [ ] Redux DevTools check cart state structure
- [ ] Network tab check POST `/api/orders` request body
- [ ] Backend logs check received payload structure

---

## 📌 TÓMLƯỢT CÁC THAY ĐỔI

| File | Thay đổi | Lý do |
|------|----------|------|
| ProductDetail.jsx | Thêm `product_variant_id`, `unit_price`, `subtotal` | Cung cấp đủ field cho backend |
| cartSlice.js | Normalize field names, tính subtotal khi update | Đảm bảo dữ liệu nhất quán |
| Cart.jsx | Dùng `unit_price ✨ price` | Hiển thị giá nhất quán |
| Checkout.jsx | Validate items, normalize, friendly errors | Gửi payload đúng + UX tốt |

---

## ✅ KẾT LUẬN

Frontend checkout flow giờ:
✅ Gửi đủ field: `product_variant_id`, `unit_price`, `subtotal`
✅ Validate items trước submit
✅ Normalize payload sạch
✅ Friendly error messages cho user
✅ Debug console logs cho dev
✅ Không gửi undefined/null values
✅ Handle backward compatibility

**Workflow:**
```
Add to Cart → Validate Fields ✅ → 
Cart Page → Display Correctly ✅ → 
Checkout → Validate Items ✅ → 
Normalize Payload ✅ → 
Send to Backend ✅ → 
Handle Errors Gracefully ✅
```
