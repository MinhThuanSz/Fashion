/**
 * PHÂN TÍCH LỖI VALIDATION CHECKOUT
 * 
 * Lỗi từ frontend:
 * {
 *   "success": false,
 *   "message": "Validation Error",
 *   "errors": [
 *     "Mã sản phẩm phải là số nguyên",
 *     "\"items[0].product_id\" is not allowed",
 *     "Mã sản phẩm phải là số nguyên",
 *     "\"items[1].product_id\" is not allowed"
 *   ]
 * }
 */

// ============================================
// 1. NGUYÊN NHÂN LỖI
// ============================================

// Frontend đang gửi:
const frontendPayload = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_id: 1,          // ❌ SAIHI - Frontend gửi 'product_id'
      quantity: 2,
      unit_price: 1000000,
      subtotal: 2000000
    },
    {
      product_id: 3,          // ❌ SAIHI - Frontend gửi 'product_id'
      quantity: 1,
      unit_price: 500000,
      subtotal: 500000
    }
  ]
};

// Backend validation schema mong đợi:
/*
const orderSchema = Joi.object({
  ...
  items: Joi.array().items(
    Joi.object({
      product_variant_id: Joi.number()...  // ✅ Backend mong đợi 'product_variant_id'
      quantity: Joi.number()...
      unit_price: Joi.number()...
      subtotal: Joi.number()...
    })
  )
});
*/

// ============================================
// 2. TẠI SAO CÓ LỖI VALIDATION
// ============================================

/*
Lỗi:
1. "Mã sản phẩm phải là số nguyên"
   - Validation schema định nghĩa: 'number.base': 'Mã sản phẩm phải là số nguyên'
   - Nhưng frontend gửi `product_id` (không phải `product_variant_id`)
   - → Joi báo field `product_variant_id` missing

2. "items[0].product_id" is not allowed
   - Joi mặc định không cho phép field không được định nghĩa trong schema
   - Frontend gửi `product_id` nhưng schema không có field này
   - → Joi báo field này "not allowed"

Kết luận: Frontend và backend sử dụng tên field khác nhau!
*/

// ============================================
// 3. GIẢI PHÁP
// ============================================

// Giải pháp 1: Sửa Frontend (TỐT NHẤT)
// ────────────────────────────────────
// Frontend phải gửi `product_variant_id` thay vì `product_id`

const correctPayload = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 1,   // ✅ ĐÚNG - Gửi 'product_variant_id'
      quantity: 2,
      unit_price: 1000000,
      subtotal: 2000000
    },
    {
      product_variant_id: 3,   // ✅ ĐÚNG - Gửi 'product_variant_id'
      quantity: 1,
      unit_price: 500000,
      subtotal: 500000
    }
  ]
};

// Giải pháp 2: Sửa Backend Schema (WORKAROUND)
// ────────────────────────────────────────────
// Cho phép cả `product_id` và `product_variant_id`, sau đó map trong service

/*
const orderSchema = Joi.object({
  ...
  items: Joi.array().items(
    Joi.object().unknown(true)  // ✅ Cho phép extra fields
      .keys({
        product_variant_id: Joi.number().integer().positive(),
        product_id: Joi.number().integer().positive(),
        quantity: Joi.number().integer().greater(0).required(),
        unit_price: Joi.number().min(0).required(),
        subtotal: Joi.number().min(0).required()
      })
      .or('product_variant_id', 'product_id')  // Một trong hai phải có
  )
});

// Sau đó trong service:
const orderItemsInput = items.map(item => ({
  product_variant_id: item.product_variant_id || item.product_id,  // ← Map product_id → product_variant_id
  quantity: item.quantity,
  ...
}));
*/

// ============================================
// 4. KIẾN NGHỊ: FRONTEND PHẢI GỬI ĐÚNG SCHEMA
// ============================================

/*
Vì bảng order_items trong DB lưu `product_variant_id` chứ không phải `product_id`:

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product_variant_id INT,      // ← Lưu variant ID, không phải product ID
  quantity INT,
  unit_price DECIMAL,
  ...
);

Và cart_items cũng lưu `product_variant_id`:

CREATE TABLE cart_items (
  id INT PRIMARY KEY,
  cart_id INT,
  product_variant_id INT,      // ← Lưu variant ID
  quantity INT,
  ...
);

Nên frontend PHẢI gửi `product_variant_id` để tạo order item đúng cách.
*/

// ============================================
// 5. KHUYẾN CÁO
// ============================================

/*
❌ LỖI: Frontend chỉ gửi `product_id`
  - Mất thông tin về size/màu/biến thể
  - Không biết lưu order item của variant nào
  - Không thể tra cứu lịch sử mua hàng đúng variant

✅ ĐÚNG: Frontend gửi `product_variant_id`
  - Giữ toàn bộ thông tin variant
  - Order item được tạo đúng theo variant
  - Có thể tra cứu lịch sử và tính toán đúng inventory

Giải pháp: Frontend cần map cart item → order item đúng cách
*/

// ============================================
// 6. HƯỚNG DẪN SỬA FRONTEND (REACT)
// ============================================

/*
// pages/CheckoutPage.jsx - TRƯỚC (SAI)
const handleCheckout = async () => {
  const orderData = {
    receiver_name,
    phone,
    shipping_address,
    payment_method,
    items: cart.items.map(item => ({
      product_id: item.product_id,                // ❌ SAI - gửi product_id
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal
    }))
  };
  
  await api.post('/orders', orderData);
};

// pages/CheckoutPage.jsx - SAU (ĐÚNG)
const handleCheckout = async () => {
  const orderData = {
    receiver_name,
    phone,
    shipping_address,
    payment_method,
    items: cart.items.map(item => ({
      product_variant_id: item.product_variant_id,  // ✅ ĐÚNG - gửi product_variant_id
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal
    }))
  };
  
  await api.post('/orders', orderData);
};
*/

// ============================================
// 7. KIỂM TRA CART ITEM STRUCTURE
// ============================================

/*
Khi lấy giỏ hàng từ API, nó sẽ trả:

GET /api/carts

{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "total_amount": 3000000,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "product_variant_id": 5,      // ← Cart lưu product_variant_id
        "quantity": 2,
        "unit_price": 1500000,
        "subtotal": 3000000,
        "variant": {                  // ← Includes populated variant
          "id": 5,
          "product_id": 1,
          "sku": "NIKE-AM270-41-BLACK",
          "stock": 10,
          "Product": {
            "id": 1,
            "name": "Nike Air Max 270",
            ...
          }
        }
      }
    ]
  }
}

Vì vậy, frontend phải map như thế này:

items: cart.items.map(cartItem => ({
  product_variant_id: cartItem.product_variant_id,  // ✅ Sử dụng product_variant_id từ cart
  quantity: cartItem.quantity,
  unit_price: cartItem.unit_price,
  subtotal: cartItem.subtotal
}))
*/
