/**
 * POSTMAN COLLECTION - TEST CHECKOUT FLOW
 * ======================================
 * 
 * Copy-paste những test này vào Postman để test hết chức năng checkout
 */

// ============================================
// SETUP (Làm 1 lần)
// ============================================

/*
1. Tạo Environment trong Postman:
   - Name: FashionStoreAPI
   - Variables:
     * BASE_URL: http://localhost:5000/api
     * TOKEN: (sẽ lấy sau)
*/

// ============================================
// TEST 1: LOGIN - Lấy Token
// ============================================

/*
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "user_password"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Credentials từ seed:
- User: user@gmail.com / user_password
- Admin: admin@gmail.com / admin_password

LÀM TIẾP:
1. Copy token từ response
2. Vào Postman → Environment → FashionStoreAPI
3. Set TOKEN = (paste token)
*/

// ============================================
// TEST 2: GET CART - Lấy giỏ hàng
// ============================================

/*
GET http://localhost:5000/api/carts
Authorization: Bearer {{TOKEN}}

Expected: 200 OK
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 45,
    "total_amount": 500000,
    "items": [
      {
        "id": 123,
        "product_variant_id": 5,
        "quantity": 1,
        "unit_price": 500000,
        "subtotal": 500000,
        "variant": {
          "id": 5,
          "product_id": 1,
          "size": "L",
          "color": "Red",
          "stock": 50
        }
      }
    ]
  }
}

Note: Lưu product_variant_id từ đây để dùng ở test order
*/

// ============================================
// TEST 3: ADD TO CART - Thêm sản phẩm vào giỏ
// ============================================

/*
POST http://localhost:5000/api/carts/items
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "product_variant_id": 1,
  "quantity": 2
}

Expected: 200 OK
Response: Full cart data

⚠️ REQUIRED: product_variant_id MUST be included!
Lấy product_variant_id từ /api/variants endpoint
ví dụ: product_variant_id: 1, 2, 3, 4, 5, 6, 7
*/

// ============================================
// TEST 4: UPDATE CART ITEM - Sửa số lượng
// ============================================

/*
IMPORTANT: Thêm item trước (TEST 3), lấy item ID từ response
Ví dụ: nếu item ID = 1, dùng ID đó

PUT http://localhost:5000/api/carts/items/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "quantity": 3
}

Expected: 200 OK
Response: Updated cart

Note: 
- Thay "1" bằng item ID thực từ TEST 3 response
- Hoặc GET /api/carts để xem list items và lấy ID
*/

// ============================================
// TEST 5: REMOVE FROM CART - Xóa sản phẩm
// ============================================

/*
IMPORTANT: Dùng item ID thực từ TEST 3 response (ví dụ: 1)

DELETE http://localhost:5000/api/carts/items/1
Authorization: Bearer {{TOKEN}}

Expected: 200 OK
Response: Updated cart (without item)

Note: Thay "1" bằng item ID thực
*/

// ============================================
// TEST 6: CLEAN CART - Làm sạch item lỗi
// ============================================

/*
POST http://localhost:5000/api/carts/clean
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

Body: (empty) {}

Expected: 200 OK
Response:
{
  "success": true,
  "data": {
    "cleaned": 0,
    "remaining": 1,
    "total_amount": 250000
  }
}

Note: Xóa items có variant không tồn tại hoặc không active
*/

// ============================================
// TEST 7: CREATE ORDER - Minimal Payload
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Nguyễn Văn A",
  "phone": "0901234567",
  "shipping_address": "123 Đường ABC, Quận 1, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 1
    }
  ]
}

Expected: 201 Created
Response:
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 456,
    "user_id": 45,
    "order_status": "PENDING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "total_amount": 200000,
    "items": [...]
  }
}

Note:
- Backend sẽ tự tính unit_price + subtotal từ DB
- Stock sẽ tự trừ
- product_variant_id: 1-7 (từ seed)
*/

// ============================================
// TEST 8: CREATE ORDER - Full Payload
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Phạm Thị B",
  "phone": "0912345678",
  "shipping_address": "456 Đường XYZ, Quận 10, TP.HCM",
  "note": "Giao hôm thứ 2 ạ, để trước cửa",
  "payment_method": "TRANSFER",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 1,
      "unit_price": 200000,
      "subtotal": 200000
    },
    {
      "product_variant_id": 2,
      "quantity": 2,
      "unit_price": 200000,
      "subtotal": 400000
    }
  ]
}

Expected: 201 Created
Response: Order data

Note: Frontend CÓ THỂ gửi unit_price, backend sẽ validate
*/

// ============================================
// TEST 9: CREATE ORDER - Using product_id
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Trần Văn C",
  "phone": "0923456789",
  "shipping_address": "789 Đường DEF, Bình Thạnh, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}

Expected: 201 Created
Response: Order data

Note: Backend sẽ tự tìm first available variant của product 2
Product IDs từ seed: 1, 2, 3, 4, 5
*/

// ============================================
// TEST 10: ERROR - Missing product ID
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Võ Sáng D",
  "phone": "0934567890",
  "shipping_address": "999 Đường GHI, Tân Phú, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "quantity": 1
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Mỗi sản phẩm phải có product_variant_id hoặc product_id",
    "💡 Mỗi sản phẩm trong đơn hàng phải có product_variant_id hoặc product_id..."
  ]
}
*/

// ============================================
// TEST 11: ERROR - Invalid quantity
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Dương Văn E",
  "phone": "0945678901",
  "shipping_address": "111 Đường JKL, Gò Vấp, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 0
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Số lượng phải lớn hơn 0"]
}
*/

// ============================================
// TEST 12: ERROR - Missing receiver_name
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "phone": "0956789012",
  "shipping_address": "222 Đường MNO, Thủ Đức, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Tên người nhận là bắt buộc"]
}
*/

// ============================================
// TEST 13: ERROR - Missing phone
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Lê Văn F",
  "shipping_address": "333 Đường PQR, Phú Nhuận, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Số điện thoại là bắt buộc"]
}
*/

// ============================================
// TEST 14: ERROR - Empty items array
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Ngô Văn G",
  "phone": "0967890123",
  "shipping_address": "444 Đường STU, Bình Tân, TP.HCM",
  "payment_method": "COD",
  "items": []
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Đơn hàng phải có ít nhất 1 sản phẩm"]
}
*/

// ============================================
// TEST 15: ERROR - Invalid payment method
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Trịnh Văn H",
  "phone": "0978901234",
  "shipping_address": "555 Đường VWX, Tây Hồ, TP.HCM",
  "payment_method": "CREDIT_CARD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Phương thức thanh toán không hợp lệ"]
}

Note: Chỉ chấp nhận COD, TRANSFER, CASH
*/

// ============================================
// TEST 16: ERROR - Stock insufficient
// ============================================

/*
POST http://localhost:5000/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

BODY:
{
  "receiver_name": "Hồ Văn I",
  "phone": "0989012345",
  "shipping_address": "666 Đường YZ, Ba Đình, TP.HCM",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 999
    }
  ]
}

Expected: 400 Bad Request
Response:
{
  "errors": ["Sản phẩm chỉ còn 50 cái trong kho, nhưng bạn muốn đặt 999 cái"]
}

Note: Variant 1 chỉ có stock: 50
*/

// ============================================
// TEST 17: GET MY ORDERS - Lấy đơn hàng của user
// ============================================

/*
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer {{TOKEN}}

Expected: 200 OK
Response:
{
  "success": true,
  "data": [
    {
      "id": 456,
      "user_id": 45,
      "order_status": "PENDING",
      "total_amount": 1100000,
      "items": [...]
    }
  ]
}
*/

// ============================================
// TEST 18: GET ORDER BY ID - Chi tiết đơn hàng
// ============================================

/*
GET http://localhost:5000/api/orders/1
Authorization: Bearer {{TOKEN}}

Expected: 200 OK
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "receiver_name": "Nguyễn Văn A",
    "phone": "0901234567",
    "shipping_address": "123 Đường ABC, Quận 1, TP.HCM",
    "order_status": "PENDING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "total_amount": 200000,
    "items": [
      {
        "product_variant_id": 1,
        "quantity": 1,
        "unit_price": 200000,
        "subtotal": 200000
      }
    ]
  }
}

Note: Thay "1" bằng order ID thực từ TEST 7
*/

// ============================================
// TEST 19: UPDATE ORDER STATUS (Admin)
// ============================================

/*
PUT http://localhost:5000/api/orders/1/status
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

BODY:
{
  "status": "SHIPPED",
  "payment_status": "PAID"
}

Expected: 200 OK
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "order_status": "SHIPPED",
    "payment_status": "PAID"
  }
}

Note: 
- Chỉ admin mới call được
- Thay "1" bằng order ID thực
- Status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
*/

// ============================================
// TEST 20: GET ALL ORDERS (Admin)
// ============================================

/*
GET http://localhost:5000/api/orders
Authorization: Bearer {{ADMIN_TOKEN}}

Expected: 200 OK
Response:
{
  "success": true,
  "data": [
    { order1... },
    { order2... }
  ]
}

Note: 
- Chỉ admin mới call được
- Xem tất cả đơn hàng từ all users
*/

// ============================================
// POSTMAN COLLECTION JSON
// ============================================

/*
Nếu muốn import toàn bộ luôn, copy cái này vào Postman:

File → Import → Paste Raw Text → Chọn file này

Hoặc:
1. Tạo Collection mới
2. Click "..." → "Import"
3. Paste content dưới đây
*/

{
  "info": {
    "name": "Fashion Store - Checkout Flow",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{TOKEN}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "1. Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"user@gmail.com\",\"password\":\"user_password\"}"
        },
        "url": {
          "raw": "{{BASE_URL}}/auth/login",
          "host": ["{{BASE_URL}}"],
          "path": ["auth", "login"]
        }
      }
    },
    {
      "name": "2. Get Cart",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{BASE_URL}}/carts",
          "host": ["{{BASE_URL}}"],
          "path": ["carts"]
        }
      }
    },
    {
      "name": "3. Add to Cart",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"product_variant_id\":1,\"quantity\":2}"
        },
        "url": {
          "raw": "{{BASE_URL}}/carts/items",
          "host": ["{{BASE_URL}}"],
          "path": ["carts", "items"]
        }
      }
    },
    {
      "name": "7. Create Order - Minimal",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"receiver_name\":\"Test User\",\"phone\":\"0901234567\",\"shipping_address\":\"TP.HCM\",\"payment_method\":\"COD\",\"items\":[{\"product_variant_id\":1,\"quantity\":1}]}"
        },
        "url": {
          "raw": "{{BASE_URL}}/orders",
          "host": ["{{BASE_URL}}"],
          "path": ["orders"]
        }
      }
    },
    {
      "name": "10. Error - Missing product ID",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"receiver_name\":\"Test\",\"phone\":\"0901234567\",\"shipping_address\":\"TP.HCM\",\"payment_method\":\"COD\",\"items\":[{\"quantity\":1}]}"
        },
        "url": {
          "raw": "{{BASE_URL}}/orders",
          "host": ["{{BASE_URL}}"],
          "path": ["orders"]
        }
      }
    },
    {
      "name": "17. Get My Orders",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{BASE_URL}}/orders/my-orders",
          "host": ["{{BASE_URL}}"],
          "path": ["orders", "my-orders"]
        }
      }
    }
  ]
}

// ============================================
// CÁCH CHẠY
// ============================================

/*
1. Mở Postman
2. Create Environment "FashionStore"
   - BASE_URL: http://localhost:5000/api
   - TOKEN: (sẽ fill sau)

3. Chạy TEST 1 (Login)
   - Email: user@gmail.com
   - Password: user_password
   → Copy token
   
4. Set TOKEN vào Environment
5. Chạy theo thứ tự:
   TEST 2 (Get Cart)
   TEST 3 (Add to Cart - variant 1, 2, 3, 4, 5, 6, 7)
   TEST 7 (Create Order - Success)
   TEST 10 (Error case)
   TEST 17 (Get My Orders)

6. Nếu muốn test error case khác, chạy TEST 11, 12, 13, ...

7. Admin Test (nếu có):
   - Login: admin@gmail.com / admin_password
   - TEST 19 (Update Order Status)
   - TEST 20 (Get All Orders)
*/

// ============================================
// EXPECTED RESULTS
// ============================================

/*
✅ TEST 1: 200 OK, có token
✅ TEST 2: 200 OK, empty cart
✅ TEST 3: 200 OK, items added (dùng variant ID: 1-7)
✅ TEST 7: 201 Created, order ID returned
✅ TEST 10: 400 Bad Request, error message rõ
✅ TEST 17: 200 OK, thấy order vừa tạo

Nếu không pass, check:
- Backend server running?
- npm run seed chạy xong?
- Token hợp lệ?
- product_variant_id tồn tại (1-7)?
- Stock > quantity?
*/

module.exports = {
  BASE_URL: 'http://localhost:5000/api',
  TOKEN: 'paste_token_here',
  USER_EMAIL: 'user@gmail.com',
  USER_PASSWORD: 'user_password',
  ADMIN_EMAIL: 'admin@gmail.com',
  ADMIN_PASSWORD: 'admin_password'
};