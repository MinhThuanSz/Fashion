# 🛒 HƯỚNG DẪN SỬA LỖI CHECKOUT & THANH TOÁN

## 📋 TÓMLƯỢC VẤN ĐỀ

**Lỗi gốc:**
```
"Sản phẩm với Variant ID 5 không tồn tại trong hệ thống!"
```

**Nguyên nhân:**
1. **orderService.js** có logic "3 strategy" phức tạp → khó debug
2. **cartService.js** không kiểm tra `status=1` của variant → cart chứa item lỗi
3. **Không có cleanup** → cart tham chiếu đến variant đã xóa
4. **Frontend** cache dữ liệu cũ → gửi variant_id không hợp lệ

---

## ✅ CÁC SỬA ĐÃ THỰC HIỆN

### 1. **Backend (Node.js + Express)**

#### ✅ File: `src/services/orderService.js`
**Sửa lỗi:**
- ❌ Loại bỏ "3 strategy" phức tạp → ✅ Logic đơn giản: kiểm tra variant bằng PK
- ❌ Không kiểm tra `status=1` → ✅ Verify `status=1` ở mỗi item
- ❌ Demo fallback stock → ✅ Kiểm tra stock thực tế, reject nếu không đủ
- ❌ Error thô → ✅ Error message rõ ràng, thân thiện

**Cải thiện:**
```javascript
// Kiểm tra từng item chi tiết
for (let i = 0; i < orderItemsInput.length; i++) {
  const variant = await ProductVariant.findByPk(variant_id);
  
  if (!variant) throw Error('Sản phẩm không tồn tại...');
  if (variant.status !== 1) throw Error('Sản phẩm không còn khả dụng...');
  if (variant.stock < qty) throw Error('Hết hàng...');
}
```

#### ✅ File: `src/services/cartService.js`
**Sửa lỗi:**
- ❌ Chỉ kiểm tra `findByPk` → ✅ Thêm kiểm tra `status=1`
- ❌ Error message không rõ → ✅ Error message chi tiết

**Cải thiện:**
```javascript
if (!variant) throw Error('Sản phẩm không tồn tại...');
if (variant.status !== 1) throw Error('Sản phẩm không còn khả dụng...');
if (variant.stock < qty) throw Error('Chỉ còn X cái...');
```

#### ✅ File: `src/validations/productValidation.js`
**Sửa lỗi:**
- ❌ Validation quá tối giản → ✅ Thêm validation chi tiết cho order
- ❌ Message tiếng Anh → ✅ Message tiếng Việt

**Thêm:**
```javascript
const orderSchema = Joi.object({
  receiver_name: Joi.string().required().messages({...}),
  phone: Joi.string().required().messages({...}),
  payment_method: Joi.string().valid('COD', 'TRANSFER', 'CASH'),
  items: Joi.array().min(1).items(
    Joi.object({
      product_variant_id: Joi.number().positive().required(),
      quantity: Joi.number().greater(0).required(),
      ...
    })
  )
});
```

#### ✅ File: `src/controllers/cartController.js`
**Sửa lỗi:**
- ❌ Không có endpoint clean cart → ✅ Thêm `cleanCart` controller

**Thêm:**
```javascript
const cleanCart = async (req, res) => {
  const result = await cleanCartByUserId(req.user.id);
  res.json({ success: true, data: {...} });
};
```

#### ✅ File: `src/routes/cartRoutes.js`
**Sửa lỗi:**
- ❌ Không có route clean cart → ✅ Thêm `POST /carts/clean`

**Thêm:**
```javascript
router.post('/clean', protect, cleanCart);
```

### 2. **Utility Scripts**

#### ✅ File: `src/utils/cartCleaner.js` (NEW)
**Chức năng:**
- Làm sạch cart của user: loại bỏ items có variant không tồn tại
- Loại bỏ items có variant bị ẩn (`status != 1`)
- Cập nhật `total_amount` sau khi làm sạch

**Cách dùng:**
```bash
# Chạy script trực tiếp
node src/utils/cartCleaner.js

# Hoặc gọi từ service
const { cleanCartByUserId } = require('./cartCleaner');
await cleanCartByUserId(userId);
```

#### ✅ File: `src/utils/CHECKOUT_FRONTEND_GUIDE.js` (NEW)
**Hướng dẫn:**
- Cách sửa CheckoutPage component
- Cách gọi API clean cart + fetch cart mới
- Error handling best practices

### 3. **Frontend (React)**
Hãy xem `src/utils/CHECKOUT_FRONTEND_GUIDE.js` để biết chi tiết

---

## 🧪 HƯỚNG DẪN TEST

### **Bước 1: Chuẩn bị dữ liệu**
```bash
# Tạo/reset database
node seed.js
```

### **Bước 2: Khởi động server**
```bash
npm run dev
# hoặc
npm start
```

### **Bước 3: Test Flow Hoàn Chỉnh**

#### 🧪 **Test 1: Thêm sản phẩm hợp lệ vào cart**
```bash
# POST /api/carts/items
{
  "product_variant_id": 1,  // Variant đầu tiên từ seed.sql
  "quantity": 2
}

# Expected: ✓ Item được thêm vào cart, cart.total_amount được cập nhật
```

#### 🧪 **Test 2: Checkout thành công (Happy Path)**
```bash
# POST /api/orders
{
  "receiver_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "shipping_address": "123 Đường 1, TP.HCM",
  "note": "Giao buổi chiều",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 2,
      "unit_price": 3150000,
      "subtotal": 6300000
    }
  ]
}

# Expected: ✓ Order tạo thành công, cart được clear, stock được trừ
```

#### 🧪 **Test 3: Checkout với variant không tồn tại**
```bash
# POST /api/orders
{
  "receiver_name": "Nguyễn Văn B",
  "phone": "0123456789",
  "shipping_address": "456 Đường 2, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 99999,  // ID không tồn tại
      "quantity": 1,
      "unit_price": 1000000,
      "subtotal": 1000000
    }
  ]
}

# Expected: ✓ Error 400 - "Sản phẩm [ID: 99999] không tồn tại trong hệ thống..."
```

#### 🧪 **Test 4: Checkout khi variant bị ẩn (status=0)**
```bash
# 1. Thêm item vào cart (variant_id=1)
POST /api/carts/items
{
  "product_variant_id": 1,
  "quantity": 1
}

# 2. Ẩn variant (admin chỉnh sửa)
UPDATE product_variants SET status=0 WHERE id=1;

# 3. Cố gắng checkout
POST /api/orders
{
  ...
  "items": [
    {"product_variant_id": 1, "quantity": 1, ...}
  ]
}

# Expected: ✓ Error 400 - "Sản phẩm [ID: 1] không còn khả dụng..."
```

#### 🧪 **Test 5: Checkout khi hết stock**
```bash
# Variant chỉ có 5 cái trong kho
POST /api/orders
{
  ...
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 10,  // Yêu cầu 10, nhưng chỉ có 5
      "unit_price": 1000000,
      "subtotal": 10000000
    }
  ]
}

# Expected: ✓ Error 400 - "Sản phẩm [ID: 1] chỉ còn 5 cái, nhưng bạn muốn 10 cái..."
```

#### 🧪 **Test 6: Làm sạch cart**
```bash
# 1. Thêm item lỗi vào cart (manual DB update)
INSERT INTO cart_items (cart_id, product_variant_id, quantity, unit_price, subtotal) 
VALUES (1, 99999, 1, 100000, 100000);

# 2. Gọi clean cart API
POST /api/carts/clean

# Expected: ✓ Item lỗi được loại bỏ, total_amount được cập nhật
```

#### 🧪 **Test 7: Validation order form**
```bash
# POST /api/orders (thiếu required field)
{
  "receiver_name": "",  // ❌ Trống
  "phone": "0123456789",
  "shipping_address": "123 Đường 1",
  "payment_method": "COD",
  "items": []  // ❌ Trống
}

# Expected: ✓ Error validation
```

#### 🧪 **Test 8: Add to cart với invalid quantity**
```bash
# POST /api/carts/items
{
  "product_variant_id": 1,
  "quantity": 0  // ❌ Số lượng phải > 0
}

# Expected: ✓ Error validation
```

### **Bước 4: Sử dụng Postman Collection**

Dùng file `postman_collection.json` để test nhanh:

```bash
# Import vào Postman
File → Import → Chọn postman_collection.json

# Test thứ tự:
1. Add to Cart (Product Variant 1) - Happy Path
2. Get Cart
3. Create Order (Success)
4. Get My Orders
5. Create Order (Variant Not Found)
6. Clean Cart
```

---

## 🔍 KIỂM TRA DATABASE

### **Xem dữ liệu sau checkout:**

```sql
-- Xem cart items
SELECT * FROM cart_items WHERE cart_id = 2;

-- Xem orders created
SELECT * FROM orders ORDER BY created_at DESC;

-- Xem order items
SELECT oi.*, pv.sku FROM order_items oi
JOIN product_variants pv ON oi.product_variant_id = pv.id
ORDER BY oi.created_at DESC;

-- Xem stock đã trừ
SELECT id, sku, stock FROM product_variants WHERE id IN (1, 2, 3);
```

---

## 📝 DANH SÁCH FILE THAY ĐỔI

### **Backend**
| File | Thay đổi |
|------|-----------|
| `src/services/orderService.js` | ✅ Sửa logic checkout, kiểm tra variant chi tiết |
| `src/services/cartService.js` | ✅ Thêm kiểm tra `status=1`, error message tốt hơn |
| `src/controllers/cartController.js` | ✅ Thêm endpoint `cleanCart` |
| `src/routes/cartRoutes.js` | ✅ Thêm route `POST /carts/clean` |
| `src/validations/productValidation.js` | ✅ Cải thiện validation, message tiếng Việt |
| `src/utils/cartCleaner.js` | ✅ NEW - Script làm sạch cart |

### **Documentation**
| File | Mục đích |
|------|----------|
| `src/utils/CHECKOUT_FRONTEND_GUIDE.js` | ✅ NEW - Hướng dẫn frontend |
| `CHECKOUT_FIX_GUIDE.md` | ✅ NEW - File này |

---

## 🚀 CẢI THIỆN TƯƠNG LAI

1. **Frontend**: Implement CheckoutPage theo guide
2. **Admin Dashboard**: Thêm endpoint `/api/admin/carts/cleanup` để admin chạy cleanup toàn bộ
3. **Monitoring**: Log những cart item bị xóa để debug
4. **Email Notification**: Gửi email xác nhận đơn hàng
5. **Payment Gateway**: Integrate Stripe / VNPAY / Momo cho thanh toán online

---

## 📞 SUPPORT

Nếu vẫn gặp lỗi:

1. **Check error message** - Đọc kỹ message từ API
2. **Clean cart** - Gọi `POST /api/carts/clean` trước checkout
3. **Verify database** - Kiểm tra dữ liệu trong database
4. **Check logs** - Xem console/log của Node.js server
5. **Reset data** - Chạy `node seed.js` để reset dữ liệu test

---

**Cập nhật lần cuối:** 2025-04-06
**Phiên bản:** 1.0 - Stable
