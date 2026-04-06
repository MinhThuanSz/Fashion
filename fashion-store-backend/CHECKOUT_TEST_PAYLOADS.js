/**
 * TEST CHECKOUT PAYLOADS
 * 
 * Copy-paste các payload này để test API endpoints
 */

// ============================================
// ❌ SAI - Frontend đang gửi (LỖI CỦ)
// ============================================

const WRONG_CHECKOUT_PAYLOAD = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  note: "Giao chiều",
  payment_method: "COD",
  items: [
    {
      product_id: 1,              // ❌ SAI - gửi product_id
      quantity: 2,
      unit_price: 1500000,
      subtotal: 3000000
    },
    {
      product_id: 3,              // ❌ SAI - gửi product_id
      quantity: 1,
      unit_price: 2500000,
      subtotal: 2500000
    }
  ]
};

// Error nhận được:
/*
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Mã sản phẩm phải là số nguyên",
    "\"items[0].product_id\" is not allowed",
    "Mã sản phẩm phải là số nguyên",
    "\"items[1].product_id\" is not allowed"
  ]
}
*/

// ============================================
// ✅ ĐÚNG - Sửa payload (PHƯƠNG ÁN 1: Gửi product_variant_id)
// ============================================

const CORRECT_CHECKOUT_PAYLOAD_VARIANT_ID = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  note: "Giao chiều",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 1,      // ✅ ĐÚNG - gửi product_variant_id
      quantity: 2,
      unit_price: 3150000,
      subtotal: 6300000
    },
    {
      product_variant_id: 5,      // ✅ ĐÚNG - gửi product_variant_id
      quantity: 1,
      unit_price: 2520000,
      subtotal: 2520000
    }
  ]
};

// Expected response:
/*
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "receiver_name": "Nguyễn Văn A",
    "phone": "0123456789",
    "shipping_address": "123 Đường 1, TP.HCM",
    "total_amount": 8820000,
    "order_status": "PENDING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "created_at": "2024-04-06T10:30:00Z",
    "updated_at": "2024-04-06T10:30:00Z"
  }
}
*/

// ============================================
// ✅ ĐÚNG - Sửa payload (PHƯƠNG ÁN 2: Gửi product_id - Fallback)
// ============================================

const CORRECT_CHECKOUT_PAYLOAD_PRODUCT_ID = {
  receiver_name: "Trần Thị B",
  phone: "0987654321",
  shipping_address: "456 Đường 2, TP.HCM",
  note: "Giao nhanh",
  payment_method: "TRANSFER",
  items: [
    {
      product_id: 1,              // ✅ ĐÚNG (FALLBACK) - Backend sẽ tìm first variant
      quantity: 1,
      unit_price: 3150000,
      subtotal: 3150000
    }
  ]
};

// Expected response:
/*
{
  "success": true,
  "data": {...}
}
*/

// ============================================
// ❌ TEST ERROR CASES
// ============================================

// 1. Missing receiver_name
const ERROR_MISSING_RECEIVER = {
  receiver_name: "",                  // ❌ Trống
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: 1, unit_price: 1000, subtotal: 1000}]
};

// Expected error:
// "Tên người nhận không được để trống"

// ---

// 2. Missing phone
const ERROR_MISSING_PHONE = {
  receiver_name: "Nguyễn Văn A",
  phone: "",                          // ❌ Trống
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: 1, unit_price: 1000, subtotal: 1000}]
};

// Expected error:
// "Số điện thoại không được để trống"

// ---

// 3. Missing shipping_address
const ERROR_MISSING_ADDRESS = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "",               // ❌ Trống
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: 1, unit_price: 1000, subtotal: 1000}]
};

// Expected error:
// "Địa chỉ giao hàng không được để trống"

// ---

// 4. Invalid payment_method
const ERROR_INVALID_PAYMENT = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "CRYPTO",           // ❌ Invalid (only: COD, TRANSFER, CASH)
  items: [{product_variant_id: 1, quantity: 1, unit_price: 1000, subtotal: 1000}]
};

// Expected error:
// "Phương thức thanh toán không hợp lệ"

// ---

// 5. Empty items
const ERROR_EMPTY_ITEMS = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: []                            // ❌ Trống
};

// Expected error:
// "Đơn hàng phải có ít nhất 1 sản phẩm"

// ---

// 6. Invalid quantity (0)
const ERROR_INVALID_QTY_ZERO = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: 0, unit_price: 1000, subtotal: 0}]
};

// Expected error:
// "Số lượng phải lớn hơn 0"

// ---

// 7. Invalid quantity (negative)
const ERROR_INVALID_QTY_NEGATIVE = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: -5, unit_price: 1000, subtotal: -5000}]
};

// Expected error:
// "Số lượng phải lớn hơn 0"

// ---

// 8. Variant not found
const ERROR_VARIANT_NOT_FOUND = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 99999, quantity: 1, unit_price: 1000, subtotal: 1000}]  // ❌ Không tồn tại
};

// Expected error:
// "Sản phẩm (ID: 99999) không còn tồn tại trong hệ thống..."

// ---

// 9. Insufficient stock
const ERROR_INSUFFICIENT_STOCK = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{product_variant_id: 1, quantity: 9999, unit_price: 3150000, subtotal: 31486500000}]  // ❌ Quá nhiều
};

// Expected error:
// "Sản phẩm (ID: 1) chỉ còn 15 cái trong kho, nhưng bạn muốn đặt 9999 cái..."

// ---

// 10. Both product_id and product_variant_id missing
const ERROR_BOTH_ID_MISSING = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1",
  payment_method: "COD",
  items: [{quantity: 1, unit_price: 1000, subtotal: 1000}]  // ❌ Không gửi ID
};

// Expected error:
// "Mã sản phẩm là bắt buộc" (because neither product_id nor product_variant_id)

// ============================================
// TEST SCRIPT (cURL - Windows PowerShell)
// ============================================

/*
# 1. Test với payload SAI (product_id)
$payload = @{
    receiver_name = "Nguyễn Văn A"
    phone = "0123456789"
    shipping_address = "123 Đường 1, TP.HCM"
    payment_method = "COD"
    items = @(
        @{
            product_id = 1              # ❌ SAI
            quantity = 2
            unit_price = 1500000
            subtotal = 3000000
        }
    )
} | ConvertTo-Json

curl.exe -X POST "http://localhost:3000/api/orders" `
    -H "Content-Type: application/json" `
    -H "Authorization: Bearer YOUR_JWT_TOKEN" `
    -d $payload

# Result: Error - product_id not allowed


# 2. Test với payload ĐÚNG (product_variant_id)
$payload = @{
    receiver_name = "Nguyễn Văn A"
    phone = "0123456789"
    shipping_address = "123 Đường 1, TP.HCM"
    payment_method = "COD"
    items = @(
        @{
            product_variant_id = 1      # ✅ ĐÚNG
            quantity = 2
            unit_price = 3150000
            subtotal = 6300000
        }
    )
} | ConvertTo-Json

curl.exe -X POST "http://localhost:3000/api/orders" `
    -H "Content-Type: application/json" `
    -H "Authorization: Bearer YOUR_JWT_TOKEN" `
    -d $payload

# Result: Success 201 - Order created
*/

// ============================================
// TEST SCRIPT (Postman/REST Client)
// ============================================

/*
POST http://localhost:3000/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

❌ SAI - Payload (product_id):
{
  "receiver_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "shipping_address": "123 Đường 1, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 1500000,
      "subtotal": 3000000
    }
  ]
}

Response: 400 Bad Request
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Mã sản phẩm phải là số nguyên",
    "\"items[0].product_id\" is not allowed",
    ...
  ]
}

---

✅ ĐÚNG - Payload (product_variant_id):
{
  "receiver_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "shipping_address": "123 Đường 1, TP.HCM",
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

Response: 201 Created
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    ...
  }
}
*/

// ============================================
// MODULE EXPORT (cho Node.js tests)
// ============================================

module.exports = {
  WRONG_CHECKOUT_PAYLOAD,
  CORRECT_CHECKOUT_PAYLOAD_VARIANT_ID,
  CORRECT_CHECKOUT_PAYLOAD_PRODUCT_ID,
  ERROR_MISSING_RECEIVER,
  ERROR_MISSING_PHONE,
  ERROR_MISSING_ADDRESS,
  ERROR_INVALID_PAYMENT,
  ERROR_EMPTY_ITEMS,
  ERROR_INVALID_QTY_ZERO,
  ERROR_INVALID_QTY_NEGATIVE,
  ERROR_VARIANT_NOT_FOUND,
  ERROR_INSUFFICIENT_STOCK,
  ERROR_BOTH_ID_MISSING
};
