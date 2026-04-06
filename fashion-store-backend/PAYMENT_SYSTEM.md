# PAYMENT SYSTEM - Simple One-Click Checkout ⚡

## ✨ NEW FEATURE
**One-click payment** - Bấm vào xong = thanh toán thành công!

---

## API ENDPOINT

### Process Payment (User Side)
```
POST /api/orders/{ORDER_ID}/payment
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Request Body:** (Empty)
```json
{}
```

**Response - Success:**
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

**Response - Error:**
```json
{
  "success": false,
  "message": "Lỗi: Đơn hàng không tồn tại"
}
```

---

## HOW IT WORKS

### Workflow

1. **User tạo order** 
   - POST `/api/orders` → Order status = **PENDING**, Payment = **UNPAID**

2. **User bấm "Thanh toán" trên giao diện** 
   - Frontend gọi: `POST /api/orders/{order_id}/payment`
   - Backend:
     - ✅ Check order tồn tại
     - ✅ Check user sở hữu order
     - ✅ Check chưa thanh toán
     - ✅ **Mark as PAID** 
     - ✅ **Auto set order_status = PROCESSING** 
     - ✅ **Save payment_date = now**
     - ✅ Return success

3. **Admin xem orders**
   - GET `/api/orders` (admin only)
   - Thấy status = PROCESSING (=đang xử lí)
   - Có thể update sang SHIPPED, DELIVERED, etc.

4. **User xem order status**
   - GET `/api/orders/my-orders`
   - Thấy payment_status = **PAID** ✅
   - Thấy order_status = **PROCESSING** (chuẩn bị giao)

---

## POSTMAN TEST

### 1️⃣ Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Copy token → Set {{TOKEN}}"**

---

### 2️⃣ Create Order
```
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "receiver_name": "Nguyễn Văn A",
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
**Copy order ID → Use in next step**

---

### 3️⃣ PROCESS PAYMENT ⭐
```
POST http://localhost:5000/api/orders/{{ORDER_ID}}/payment
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "✅ Thanh toán thành công!",
    "order_id": 123,
    "payment_status": "PAID",
    "order_status": "PROCESSING"
  }
}
```

---

### 4️⃣ Check Payment
```
GET http://localhost:5000/api/orders/{{ORDER_ID}}
Authorization: Bearer {{TOKEN}}
```

**Expected: Order có payment_status = "PAID"**

---

## ADMIN SIDE

### View All Orders
```
GET http://localhost:5000/api/orders
Authorization: Bearer {{ADMIN_TOKEN}}
```

**See all orders with:**
- Order ID
- Customer name
- Payment status (PAID ✅)
- Order status (PROCESSING, SHIPPED, etc.)

---

### Update Order Status
```
PUT http://localhost:5000/api/orders/{ORDER_ID}/status
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "status": "SHIPPED",
  "payment_status": "PAID"
}
```

**Available Order Status:**
- `PENDING` - Chờ xác nhận
- `PROCESSING` - Đang xử lí (Auto-set after payment)
- `SHIPPED` - Đang giao
- `DELIVERED` - Đã giao
- `CANCELLED` - Đã hủy

**Payment Status:**
- `UNPAID` - Chưa thanh toán
- `PAID` - Đã thanh toán ✅
- `REFUNDED` - Hoàn tiền

---

## FRONTEND INTEGRATION

### Button to Pay
```jsx
import axios from 'axios';

function PaymentButton({ orderId, token }) {
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        alert('✅ Thanh toán thành công!');
        // Refresh order status
        window.location.reload();
      }
    } catch (error) {
      alert('❌ ' + error.response.data.message);
    }
  };
  
  return (
    <button onClick={handlePayment} className="btn-pay">
      💳 Thanh toán
    </button>
  );
}

export default PaymentButton;
```

---

## DATABASE UPDATE

### If using existing database:

Run this SQL to add payment_date column:

```sql
-- Option 1: Add if not exists
IF NOT EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_date')
BEGIN
    ALTER TABLE orders
    ADD payment_date DATETIMEOFFSET;
END
GO

-- Option 2: Direct (if column doesn't exist)
-- ALTER TABLE orders
-- ADD payment_date DATETIMEOFFSET;
```

**Or run migration file:**
```
migrations/add_payment_date_to_orders.sql
```

---

## ERROR HANDLING

| Error | Cause | Solution |
|-------|-------|----------|
| "Order not found" | Order ID sai | Check order ID |
| "Not authorized" | User ≠ order owner | Login with correct user |
| "Already paid" | Đã thanh toán rồi | Do nothing, go to order status |
| "Order cancelled" | Order bị hủy | Cannot pay cancelled order |

---

## STATUS FLOW

```
Order Created
    ↓
order_status: PENDING
payment_status: UNPAID
    ↓
User clicks "Thanh toán"
    ↓ [POST /payment]
order_status: PROCESSING ← Auto-set
payment_status: PAID ← Marked
payment_date: 2024-04-06 10:30:00 ← Saved
    ↓
Admin sees in dashboard
    ↓
Admin updates: SHIPPED
    ↓
Customer sees: SHIPPED
    ↓
Admin updates: DELIVERED
    ↓
Order Complete ✅
```

---

## TESTING CHECKLIST

- [ ] Create order successfully (order_id = PENDING, UNPAID)
- [ ] Call payment endpoint (should get success message)
- [ ] Check order after payment (should be PAID + PROCESSING)
- [ ] Get all orders as admin (should show PROCESSING)
- [ ] Admin update order status to SHIPPED
- [ ] User sees order as SHIPPED
- [ ] Try payment on already-paid order (should error)
- [ ] Try payment with wrong user (should error)

---

## Quick Test Commands

**Via cURL:**

```bash
# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiver_name":"Test","phone":"0901234567","shipping_address":"TP.HCM","payment_method":"COD","items":[{"product_variant_id":5,"quantity":1}]}'

# Pay for order (replace 123 with real order ID)
curl -X POST http://localhost:5000/api/orders/123/payment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Get order status
curl -X GET http://localhost:5000/api/orders/123 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Summary ✨

| Feature | Before | After |
|---------|--------|-------|
| Payment | Complex logic | ✅ One click |
| Status | Manual update | ✅ Auto PROCESSING |
| Admin | Manual check | ✅ Dashboard view |
| User Experience | Confusing | ✅ Simple & clear |

**Now ready for production! 🚀**
