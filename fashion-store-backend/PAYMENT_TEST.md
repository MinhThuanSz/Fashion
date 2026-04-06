# PAYMENT - POSTMAN QUICK TEST

## 🎯 Test one-click payment in 3 steps

### Step 1: Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**→ Copy token to clipboard**

---

### Step 2: Create Order  
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
      "quantity": 1
    }
  ]
}
```
**Expected: 201 Created**
**→ Copy order ID from response (e.g., "id": 123)**

---

### Step 3: PROCESS PAYMENT ⭐⭐⭐
```
POST http://localhost:5000/api/orders/123/payment
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{}
```

**Replace 123 with real order ID!**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "✅ Thanh toán thành công!",
    "order_id": 123,
    "payment_status": "PAID",
    "order_status": "PROCESSING"
  }
}
```

---

### Step 4: Verify (Optional)
```
GET http://localhost:5000/api/orders/123
Authorization: Bearer {{TOKEN}}
```

**Check:**
- ✅ payment_status = "PAID"
- ✅ order_status = "PROCESSING"
- ✅ payment_date = filled

---

## ADMIN TEST

### View all orders (Admin only)
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

```
GET http://localhost:5000/api/orders
Authorization: Bearer {{ADMIN_TOKEN}}
```

**See all orders with PAID status**

---

### Update order to SHIPPED (Admin)
```
PUT http://localhost:5000/api/orders/123/status
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "status": "SHIPPED",
  "payment_status": "PAID"
}
```

---

## ERROR TESTS

### Test: Pay twice (should error)
```
POST http://localhost:5000/api/orders/123/payment
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{}
```
**Expected Error: "Đơn hàng này đã được thanh toán rồi"**

---

### Test: Wrong user pays order (should error)
```
-- Login as different user first
-- Then try to pay order from first user
POST http://localhost:5000/api/orders/123/payment
Authorization: Bearer {{DIFFERENT_TOKEN}}
Content-Type: application/json

{}
```
**Expected Error: "Không có quyền thanh toán đơn hàng này"**

---

### Test: Non-existent order (should error)
```
POST http://localhost:5000/api/orders/99999/payment
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{}
```
**Expected Error: "Đơn hàng không tồn tại"**

---

## SUCCESS CRITERIA ✅

- [ ] Step 3 returns success message
- [ ] payment_status changed to PAID
- [ ] order_status changed to PROCESSING
- [ ] Admin can see order in list
- [ ] Cannot pay twice (error message)
- [ ] Cannot pay other user's order (error message)

**All pass = Ready! 🚀**
