# POSTMAN TEST - QUICK REFERENCE

## 🔧 Setup
1. Tạo Environment: `FashionStore`
2. Biến: `BASE_URL = http://localhost:5000/api`, `TOKEN = (sẽ fill sau)`

---

## ✅ TEST FLOW

### 1️⃣ LOGIN - Lấy Token
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Copy token từ response → Paste vào Environment TOKEN**

---

### 2️⃣ GET CART
```
GET http://localhost:5000/api/carts
Authorization: Bearer {{TOKEN}}
```
**Expected:** 200 OK - Xem list items + product_variant_id

---

### 3️⃣ ADD PRODUCT TO CART
```
POST http://localhost:5000/api/carts/items
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "product_variant_id": 5,
  "quantity": 2
}
```
**Expected:** 200 OK - Item added

---

### 4️⃣ CREATE ORDER ✨ (MAIN TEST)
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Nguyễn Văn A",
  "phone": "0901234567",
  "shipping_address": "123 Đường ABC, Quận 1, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}
```
**Expected:** 201 Created - Order ID returned

---

## ❌ ERROR TEST CASES

### Error 1: Missing product ID
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Test User",
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "quantity": 1
    }
  ]
}
```
**Expected:** 400 - Error: "Mỗi sản phẩm phải có product_variant_id hoặc product_id"

---

### Error 2: Missing receiver_name
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}
```
**Expected:** 400 - Error: "Tên người nhận là bắt buộc"

---

### Error 3: Invalid quantity (0)
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Test User",
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 0
    }
  ]
}
```
**Expected:** 400 - Error: "Số lượng phải lớn hơn 0"

---

### Error 4: Empty cart
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Test User",
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "COD",
  "items": []
}
```
**Expected:** 400 - Error: "Đơn hàng phải có ít nhất 1 sản phẩm"

---

### Error 5: Invalid payment method
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Test User",
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "CRYPTO",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}
```
**Expected:** 400 - Error: "Phương thức thanh toán không hợp lệ"

---

### Error 6: Insufficient stock
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Test User",
  "phone": "0901234567",
  "shipping_address": "TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 999
    }
  ]
}
```
**Expected:** 400 - Error: "Sản phẩm chỉ còn X cái trong kho"

---

## 📋 GET ORDERS

### Get My Orders
```
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer {{TOKEN}}
```
**Expected:** 200 OK - List orders của user

---

### Get Order By ID
```
GET http://localhost:5000/api/orders/456
Authorization: Bearer {{TOKEN}}
```
**Expected:** 200 OK - Chi tiết order

---

## 🧹 OTHER ENDPOINTS

### Clean Cart (xóa items lỗi)
```
POST http://localhost:5000/api/carts/clean
Authorization: Bearer {{TOKEN}}
```

### Update Cart Item
```
PUT http://localhost:5000/api/carts/items/123
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "quantity": 5
}
```

### Remove Cart Item
```
DELETE http://localhost:5000/api/carts/items/123
Authorization: Bearer {{TOKEN}}
```

---

## 🎯 TEST ORDER

1. **TEST 1:** Login → Copy TOKEN
2. **TEST 2:** Get Cart (xem product_variant_id)
3. **TEST 3:** Add to Cart (nếu cần)
4. **TEST 4:** Create Order (main) → Phải 201
5. **TEST 5:** Get My Orders → Xem order vừa tạo
6. **ERROR TESTS:** Chạy từng cái error

---

## 📊 EXPECTED RESULTS

| Test | Status | Notes |
|------|--------|-------|
| Login | 200 | Token obtained |
| Get Cart | 200 | Product variant IDs visible |
| Add Cart | 200 | Item added |
| Create Order | **201** | Order ID returned |
| Get My Orders | 200 | Order appears in list |
| Error Tests | 400 | Proper error messages |

---

## ⚠️ COMMON ISSUES

| Issue | Solution |
|-------|----------|
| 403 Unauthorized | Token expired, login lại |
| 404 Not Found | product_variant_id không tồn tại |
| 400 validation error | Check payload format |
| Stock error | variant.stock < quantity |
| Validation error | Check required fields |

---

## 💾 TO IMPORT IN POSTMAN

1. Click **Import** button
2. **Raw Text** tab
3. Paste `POSTMAN_TEST_COLLECTION.js` content
4. Click **Import**
5. Set Environment variables

**OR** manually create requests from URLs above.