# 📦 PAYLOAD EXAMPLES & TEST CASES

## ✅ EXPECTED PAYLOAD FORMAT

### Minimal Valid Payload
```json
{
  "receiver_name": "Minh Thuận",
  "phone": "0908504227",
  "shipping_address": "123 Nguyễn Huệ, Hồ Chí Minh",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 1
    }
  ]
}
```

### Full Valid Payload (Recommended)
```json
{
  "receiver_name": "Minh Thuận",
  "phone": "0908504227",
  "shipping_address": "123 Nguyễn Huệ, Q.1, Hồ Chí Minh",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 2,
      "unit_price": 3850000,
      "subtotal": 7700000
    },
    {
      "product_variant_id": 3,
      "quantity": 1,
      "unit_price": 450000,
      "subtotal": 450000
    }
  ]
}
```

---

## ❌ INVALID PAYLOADS (NOW FIXED)

### ❌ BEFORE FIX - Sends undefined fields
```json
{
  "receiver_name": "Minh Thuận",
  "phone": "0908504227",
  "shipping_address": "123 Nguyễn Huệ",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": undefined,    ❌ UNDEFINED!
      "quantity": 2,
      "unit_price": undefined,             ❌ UNDEFINED!
      "subtotal": undefined                ❌ UNDEFINED!
    }
  ]
}
```

### ❌ BEFORE FIX - Sends wrong field names
```json
{
  "items": [
    {
      "product_id": 1,        ❌ WRONG: Should be product_variant_id
      "quantity": 2,
      "price": 3850000,       ❌ WRONG: Should be unit_price
      "total": 7700000        ❌ WRONG: Should be subtotal
    }
  ]
}
```

### ❌ AFTER FIX - All fields present & named correctly
```json
{
  "items": [
    {
      "product_variant_id": 1,  ✅ CORRECT field name
      "quantity": 2,
      "unit_price": 3850000,     ✅ CORRECT field name
      "subtotal": 7700000        ✅ CORRECT field name
    }
  ]
}
```

---

## 🧪 CART ITEM STRUCTURE

### BEFORE (❌ INCOMPLETE)
```javascript
{
  id: 1,
  name: "Nike Air Max 270",
  price: 3850000,           // ❌ Sai field name
  image: "...",
  size: "40",
  color: "Đen",
  quantity: 2
  // ❌ Thiếu: product_variant_id, unit_price, subtotal
}
```

### AFTER (✅ COMPLETE)
```javascript
{
  id: 1,                           // Product ID
  product_variant_id: 1,           // ✅ Variant ID (now present)
  name: "Nike Air Max 270",
  price: 3850000,                  // Keep for backward compat
  unit_price: 3850000,             // ✅ Correct field for backend
  image: "...",
  size: "40",
  color: "Đen",
  quantity: 2,
  subtotal: 7700000                // ✅ Pre-calculated
}
```

---

## 📝 HOW CHECKOUT MAPS CART → ORDER

```
Cart Item                    →    Order Item
─────────────────────────────────────────────
id: 1                       →    (not sent)
product_variant_id: 1       →    product_variant_id: 1 ✅
name: "Nike..."             →    (not sent)
price: 3850000              →    (not sent)
unit_price: 3850000         →    unit_price: 3850000 ✅
quantity: 2                 →    quantity: 2 ✅
subtotal: 7700000           →    subtotal: 7700000 ✅
```

---

## 🔍 VALIDATION FLOW

```
User clicks "Đặt hàng ngay"
  ↓
Form validation (name, phone, address)
  ↓
✅ All fields filled?
  ❌ No → Show error, don't continue
  ✅ Yes → Go to next step
  ↓
Cart items validation
  ├─ Check: item has product_variant_id?
  │   ❌ No → Show: "Sản phẩm [...] thiếu thông tin ID"
  │
  ├─ Check: item has unit_price > 0?
  │   ❌ No → Show: "Sản phẩm [...] thiếu giá"
  │
  └─ Check: item has quantity > 0?
      ❌ No → Show: "Sản phẩm [...] số lượng không hợp lệ"
  ↓
✅ All validations pass?
  ❌ No → Show error, don't continue
  ✅ Yes → Build normalized payload
  ↓
Normalize fields
  ├─ variantId = item.product_variant_id || item.variantId || item.id
  ├─ unitPrice = item.unit_price || item.price
  ├─ qty = parseInt(item.quantity)
  └─ subtotal = item.subtotal || (unitPrice * qty)
  ↓
Build clean payload
  {
    receiver_name, phone, shipping_address, payment_method,
    items: [{product_variant_id, quantity, unit_price, subtotal}, ...]
  }
  ↓
Send to API (/api/orders POST)
  ↓
✅ Success → Show success toast + redirect
❌ Error → Transform error message → Show friendly toast
```

---

## 🧪 MANUAL TEST COMMANDS

### Test 1: Check localStorage cart structure
```javascript
// Console: copy & paste
JSON.parse(localStorage.getItem('cartItems')).forEach(item => {
  console.log(`✅ ${item.name}:`, {
    has_product_variant_id: !!item.product_variant_id,
    has_unit_price: !!item.unit_price,
    has_subtotal: !!item.subtotal,
    values: {
      product_variant_id: item.product_variant_id,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      quantity: item.quantity
    }
  })
})
```

**Expected output:**
```
✅ Nike Air Max 270 Premium: {
  has_product_variant_id: true,
  has_unit_price: true,
  has_subtotal: true,
  values: {
    product_variant_id: 1,
    unit_price: 3850000,
    subtotal: 7700000,
    quantity: 2
  }
}
```

### Test 2: Check Redux cart state
```javascript
// If Redux DevTools is available, check:
store.getState().cart.items
```

**Expected structure:**
```javascript
[
  {
    id: 1,
    product_variant_id: 1,      // ✅ Present
    name: "Nike Air Max 270",
    unit_price: 3850000,         // ✅ Present
    quantity: 2,
    subtotal: 7700000            // ✅ Present
  }
]
```

### Test 3: Mock API call with correct payload
```javascript
// At checkout page, before API call, console shows:
console.log(
  JSON.parse(localStorage.getItem('cartItems')).every(item => 
    item.product_variant_id && item.unit_price && item.quantity > 0
  )
) // Should return: true
```

---

## 📲 TESTING SCENARIOS

### Scenario 1: Happy Path ✅
**Input:**
- Add item to cart
- Fill checkout form
- Select COD payment
- Click "Đặt hàng ngay"

**Expected:**
- Console logs clean payload
- API receives valid data
- Order created successfully
- Toast: "ĐẶT HÀNG THÀNH CÔNG!"

### Scenario 2: Invalid Cart Item ❌
**Input:**
- Somehow cart has item without product_variant_id
- Click checkout

**Expected:**
- Validation catches it
- Toast: "Sản phẩm [...] thiếu thông tin ID"
- API NOT called

### Scenario 3: Form Validation ❌
**Input:**
- Leave receiver_name empty
- Click "Đặt hàng ngay"

**Expected:**
- Toast: "Vui lòng nhập họ tên người nhận!"
- API NOT called

### Scenario 4: Backend Error Handling
**Input:**
- Backend returns error: "Product not found"
- Frontend receives error response

**Expected:**
- Toast: "Một sản phẩm trong giỏ hàng hiện không còn khả dụng..."
- NOT raw error message
- User can try again

---

## 🐛 DEBUG TIPS

### If checkout fails:

**1. Check browser console (F12)**
```
Look for: "📤 Order Payload:" log
Should show clean json with all fields
```

**2. Check Network tab (F12)**
```
POST /api/orders
Check Request body - should match expected format
Check Response status - 200 = ok, 4xx = validation error
```

**3. Check localStorage**
```javascript
JSON.parse(localStorage.getItem('cartItems'))
// Should show all items have product_variant_id, unit_price, subtotal
```

**4. Check if error is from frontend validation**
```
If toast appears BEFORE API call:
  - Form validation failed
  - Item validation failed
  - Check console for specific error message

If toast appears AFTER API call:
  - Backend validation failed
  - Check Network tab for response error
```

---

## ✅ FINAL CHECKLIST BEFORE SUBMIT

- [ ] Cart items have `product_variant_id`
- [ ] Cart items have `unit_price` (not `price`)
- [ ] Cart items have `subtotal` calculated
- [ ] Checkout form all fields filled
- [ ] Console shows "📤 Order Payload:" with clean data
- [ ] Network tab shows POST request with correct body
- [ ] No `undefined` or `null` values in payload
- [ ] All `quantity` values > 0
- [ ] All `unit_price` values > 0
- [ ] Form submits and API is called
- [ ] Success toast appears OR friendly error message

✅ All checks pass = Ready for production!
