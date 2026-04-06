/**
 * LỖI VALIDATION CHECKOUT - TÓMLƯỢC VÀ GIẢI PHÁP
 * 
 * ============================================
 * VẤNĐỀ
 * ============================================
 * 
 * Frontend gửi: items[].product_id
 * Backend mong đợi: items[].product_variant_id
 * 
 * Kết quả: Validation Error
 * - "items[0].product_id" is not allowed
 * - "Mã sản phẩm phải là số nguyên"
 * 
 * ============================================
 * NGUYÊN NHÂN
 * ============================================
 * 
 * 1. Frontend đang map cart items sai
 *    - Gửi product_id thay vì product_variant_id
 * 
 * 2. Backend validation schema
 *    - Chỉ định nghĩa product_variant_id
 *    - Không cho phép product_id
 * 
 * 3. Database model
 *    - cart_items.product_variant_id
 *    - order_items.product_variant_id
 *    - Không phải product_id
 * 
 * ============================================
 * GIẢI PHÁP ĐÃ THỰC HIỆN
 * ============================================
 */

// ============================================
// 1. SỬA VALIDATION SCHEMA
// ============================================

// File: src/validations/productValidation.js
// 
// ❌ CŨ (chỉ nhận product_variant_id REQUIRED)
// const orderSchema = Joi.object({
//   items: Joi.array().items(
//     Joi.object({
//       product_variant_id: Joi.number().required()  // ← Bắt buộc
//     })
//   )
// })

// ✅ MỚI (chấp nhận product_id HOẶC product_variant_id)
// const orderSchema = Joi.object({
//   items: Joi.array().items(
//     Joi.object({
//       product_variant_id: Joi.number().integer().positive(),
//       product_id: Joi.number().integer().positive(),
//       quantity: Joi.number().integer().greater(0).required(),
//       unit_price: Joi.number().min(0).required(),
//       subtotal: Joi.number().min(0).required()
//     }).or('product_variant_id', 'product_id').required()  // ← Một trong hai phải có
//   )
// })

// Ưu điểm:
// - Backend chấp nhận cả product_id và product_variant_id
// - Frontend có thể gửi một trong hai
// - Swagger doc rõ ràng chi tiết

// ============================================
// 2. SỬA ORDER SERVICE
// ============================================

// File: src/services/orderService.js
// 
// ❌ CŨ (chỉ xử lý product_variant_id)
// for (const item of orderItemsInput) {
//   const variant_id = item.product_variant_id;  // ← Nếu không có → undefined
//   const variant = await ProductVariant.findByPk(variant_id);
//   if (!variant) throw Error();
// }

// ✅ MỚI (xử lý cả product_id):
// for (const item of orderItemsInput) {
//   let variant_id = item.product_variant_id;
//   
//   // Nếu gửi product_id, tìm variant đầu tiên
//   if (!variant_id && item.product_id) {
//     const firstVariant = await ProductVariant.findOne({
//       where: { product_id: item.product_id, status: 1 }
//     });
//     if (!firstVariant) throw Error();
//     variant_id = firstVariant.id;
//   }
//   
//   // Tìm và xác thực variant
//   const variant = await ProductVariant.findByPk(variant_id);
//   if (!variant) throw Error();
//   if (variant.status !== 1) throw Error();
//   if (variant.stock < item.quantity) throw Error();
// }

// Ưu điểm:
// - Xử lý cả product_id và product_variant_id
// - Fallback logic: product_id → first available variant
// - Xác thực toàn bộ trước khi tạo order

// ============================================
// 3. SỬA VALIDATE MIDDLEWARE
// ============================================

// File: src/middlewares/validateMiddleware.js
//
// ❌ CŨ (error message thô)
// return res.status(400).json({
//   success: false,
//   message: 'Validation Error',
//   errors: [
//     'Mã sản phẩm phải là số nguyên',
//     '\"items[0].product_id\" is not allowed',
//     ...
//   ]
// })

// ✅ MỚI (error message thân thiện + gợi ý)
// return res.status(400).json({
//   success: false,
//   message: 'Validation Error',
//   errors: [
//     'Mã biến thể sản phẩm phải là số nguyên',
//     'Số lượng phải lớn hơn 0',
//     ...,
//     'Gợi ý: Hãy kiểm tra lại giỏ hàng và đảm bảo gửi product_variant_id hoặc product_id...'
//   ]
// })

// Ưu điểm:
// - Message chi tiết, tiếng Việt
// - Thêm gợi ý giúp debug
// - Hỗ trợ label field tùy chỉnh

// ============================================
// 4. DANH SÁCH FILE ĐÃ SỬA/TẠO
// ============================================

/*
MODIFIED FILES:
├── src/validations/productValidation.js
│   └── ✅ Sửa: Accept product_id OR product_variant_id
│
├── src/services/orderService.js
│   └── ✅ Sửa: Handle product_id → product_variant_id conversion
│
└── src/middlewares/validateMiddleware.js
    └── ✅ Sửa: Better error messages + hints

NEW DOCUMENTATION FILES:
├── VALIDATION_ERROR_ANALYSIS.js
│   └── ✅ NEW: Phân tích chi tiết error
│
├── FRONTEND_CHECKOUT_GUIDE.js
│   └── ✅ NEW: Hướng dẫn frontend React
│
└── CHECKOUT_TEST_PAYLOADS.js
    └── ✅ NEW: Test payloads (đúng & sai)
*/

// ============================================
// 5. YÊU CẦU FRONTEND PHẢI LÀM
// ============================================

/*
Frontend developers cần:

1. Map cart items → order items ĐÚNG:

   ✅ KHUYẾN NGHỊ (frontend gửi product_variant_id):
   items: cart.items.map(item => ({
     product_variant_id: item.product_variant_id,  ← KEY
     quantity: item.quantity,
     unit_price: item.unit_price,
     subtotal: item.subtotal
   }))

   ✅ FALLBACK (frontend gửi product_id):
   items: cart.items.map(item => ({
     product_id: item.product_id,  ← Backend sẽ tìm first variant
     quantity: item.quantity,
     unit_price: item.unit_price,
     subtotal: item.subtotal
   }))

   ❌ KHÔNG LÀM:
   items: cart.items.map(item => ({
     product_id: item.product_id,
     variant_id: item.variant_id,
     ...extra_fields
   }))

2. Validate cart không rỗng:
   if (!cart?.items?.length) {
     throw new Error('Giỏ hàng rỗng');
   }

3. Handle validation errors:
   if (response.errors?.includes('product_id')) {
     alert('Hãy gửi product_variant_id hoặc product_id');
   }
*/

// ============================================
// 6. TEST FLOW
// ============================================

/*
FLOW TEST CHECKOUT:

1️⃣ SETUP
   ✅ Chạy seed data: node seed.js
   ✅ Khởi động server: npm run dev
   ✅ Đăng nhập user (token từ API)

2️⃣ TEST - SAI PAYLOAD (product_id only)
   POST /api/orders
   {
     receiver_name: "Test",
     phone: "0123",
     shipping_address: "address",
     payment_method: "COD",
     items: [
       {
         product_id: 1,        ❌ (backend sẽ fallback tới variant)
         quantity: 1,
         unit_price: 1000,
         subtotal: 1000
       }
     ]
   }
   
   Response: 201 Created ✅ (backend xử lý được)

3️⃣ TEST - ĐÚNG PAYLOAD (product_variant_id)
   POST /api/orders
   {
     receiver_name: "Test",
     phone: "0123",
     shipping_address: "address",
     payment_method: "COD",
     items: [
       {
         product_variant_id: 1,  ✅ (chính xác)
         quantity: 1,
         unit_price: 3150000,
         subtotal: 3150000
       }
     ]
   }
   
   Response: 201 Created ✅

4️⃣ TEST - ERROR (variant not found)
   items: [{ product_variant_id: 99999, ... }]
   Response: 400 Bad Request
   message: "Sản phẩm (ID: 99999) không tồn tại..."

5️⃣ TEST - ERROR (insufficient stock)
   items: [{ product_variant_id: 1, quantity: 9999, ... }]
   Response: 400 Bad Request
   message: "Sản phẩm chỉ còn 15 cái, bạn muốn 9999..."

6️⃣ TEST - ERROR (empty items)
   items: []
   Response: 400 Bad Request
   message: "Đơn hàng phải có ít nhất 1 sản phẩm"
*/

// ============================================
// 7. BEFORE vs AFTER
// ============================================

/*
BEFORE (Lỗi):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend gửi:
{
  items: [{
    product_id: 1,
    quantity: 2,
    unit_price: 1000,
    subtotal: 2000
  }]
}

Backend validation:
❌ "items[0].product_id" is not allowed
❌ "Mã sản phẩm phải là số nguyên"

User thấy: Lỗi kỹ thuật khó hiểu


AFTER (Fix):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend gửi:
{
  items: [{
    product_variant_id: 1,     ← Gửi đúng
    quantity: 2,
    unit_price: 3150000,
    subtotal: 6300000
  }]
}

Backend validation:
✅ Accept
✅ Order created successfully

User thấy: Đơn hàng được tạo, hiển thị thành công

HOẶC Frontend vẫn gửi product_id:
{
  items: [{
    product_id: 1,            ← Vẫn được chấp nhận
    quantity: 2,
    unit_price: 1000,
    subtotal: 2000
  }]
}

Backend xử lý:
✅ Tìm first variant của product_id 1
✅ Map tới product_variant_id
✅ Order created successfully

User thấy: Đơn hàng được tạo
*/

// ============================================
// 8. KEY FILES REFERENCE
// ============================================

/*
📄 DOCUMENTS:
• VALIDATION_ERROR_ANALYSIS.js
  → Phân tích chi tiết error, nguyên nhân, giải pháp

• FRONTEND_CHECKOUT_GUIDE.js
  → Hướng dẫn frontend React: cách map item, handle error

• CHECKOUT_TEST_PAYLOADS.js
  → Test payloads (đúng/sai), cURL examples

• CHECKOUT_FIX_GUIDE.md
  → Hướng dẫn toàn diện (từ lần sửa trước)

📝 CODE:
• src/validations/productValidation.js
  → orderSchema: accept product_id OR product_variant_id

• src/services/orderService.js
  → convert product_id → variant_id, validate item

• src/middlewares/validateMiddleware.js
  → improved error messages

🧪 TEST:
• api_test_checkout.sh
  → cURL test script

• SQL_QUERIES_TEST_CHECKOUT.sql
  → SQL queries để verify database
*/

// ============================================
// 9. QUICK START
// ============================================

/*
🚀 QUICK FIX CHECKLIST:

1. ✅ Backend sửa xong (OrderService, Validation)
2. ❗ Frontend cần thay đổi:
   - Map cart items → order items
   - Gửi product_variant_id (hoặc product_id)
3. ✅ Test với payload đúng
4. ✅ Verify database order được tạo
5. ✅ Check order_items có product_variant_id

STEP-BY-STEP:
1. Read: FRONTEND_CHECKOUT_GUIDE.js
2. Copy: CHECKOUT_TEST_PAYLOADS.js → test
3. Update: Frontend component
4. Test: POST /api/orders
5. Verify: Database orders/order_items
*/

// ============================================
// 10. TROUBLESHOOTING
// ============================================

/*
❓ Q: Vẫn nhận error "product_id" is not allowed?
✅ A: Backend code chưa update. Restart server: npm run dev

❓ Q: Order tạo thành công nhưng item sai?
✅ A: Đảm bảo unit_price/subtotal tính đúng từ cart

❓ Q: Frontend không biết product_variant_id ở cart item?
✅ A: Call GET /api/carts, cart.items có product_variant_id

❓ Q: Sản phẩm hiển thị "N/A" ở order?
✅ A: Check variant có product/image bị populated không

❓ Q: Stock không trừ sau order?
✅ A: Check variant.stock = variant.stock - quantity được save
*/

module.exports = {
  SOLUTION_SUMMARY: `
    Frontend phải gửi product_variant_id (không phải product_id).
    Backend accept cả 2, nhưng recommend product_variant_id.
    Xem FRONTEND_CHECKOUT_GUIDE.js để fix frontend component.
  `,
  MODIFIED_FILES: [
    'src/validations/productValidation.js',
    'src/services/orderService.js',
    'src/middlewares/validateMiddleware.js'
  ],
  NEW_DOCS: [
    'VALIDATION_ERROR_ANALYSIS.js',
    'FRONTEND_CHECKOUT_GUIDE.js',
    'CHECKOUT_TEST_PAYLOADS.js'
  ],
  TEST_COMMAND: 'bash api_test_checkout.sh checkout_ok'
};
