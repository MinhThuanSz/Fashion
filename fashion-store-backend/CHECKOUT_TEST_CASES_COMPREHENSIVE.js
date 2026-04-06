/**
 * ============================================
 * DEBUG/TEST PAYLOADS FOR CHECKOUT FLOW
 * ============================================
 * 
 * This file contains all test cases and payloads
 * to validate the complete checkout flow.
 * 
 * Use these to test with Postman, cURL, or API client
 */

// ✅ TEST 1: MINIMAL VALID PAYLOAD
// Sends only required fields - Backend should auto-calculate prices
const TEST_MINIMAL_VALID = {
  receiver_name: "Nguyễn Văn A",
  phone: "0901234567",
  shipping_address: "123 Đường ABC, Quận 1, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 1
    },
    {
      product_variant_id: 6,
      quantity: 2
    }
  ]
};
// Expected: SUCCESS - Backend calculates prices from database

// ✅ TEST 2: COMPLETE VALID PAYLOAD
// Sends all fields including optional prices
const TEST_COMPLETE_VALID = {
  receiver_name: "Phạm Thị B",
  phone: "0912345678",
  shipping_address: "456 Đường XYZ, Quận 10, TP.HCM",
  note: "Giao hôm thứ 2 ạ",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 1,
      unit_price: 500000,
      subtotal: 500000
    },
    {
      product_variant_id: 6,
      quantity: 2,
      unit_price: 300000,
      subtotal: 600000
    }
  ]
};
// Expected: SUCCESS - Validates and creates order with provided prices

// ✅ TEST 3: USING PRODUCT_ID INSTEAD OF PRODUCT_VARIANT_ID
// Backend should find first available variant of product
const TEST_WITH_PRODUCT_ID = {
  receiver_name: "Trần Văn C",
  phone: "0923456789",
  shipping_address: "789 Đường DEF, Bình Thạnh, TP.HCM",
  payment_method: "TRANSFER",
  items: [
    {
      product_id: 2,  // ← Using product_id instead
      quantity: 1
    }
  ]
};
// Expected: SUCCESS - Backend finds first variant of product 2

// ❌ TEST 4: INVALID - MISSING PRODUCT ID
// Neither product_variant_id nor product_id provided
const TEST_INVALID_NO_ID = {
  receiver_name: "Võ Sáng D",
  phone: "0934567890",
  shipping_address: "999 Đường GHI, Tân Phú, TP.HCM",
  payment_method: "COD",
  items: [
    {
      quantity: 1,
      unit_price: 100000,
      subtotal: 100000
      // ❌ Missing both product_variant_id and product_id
    }
  ]
};
// Expected: VALIDATION ERROR - "must contain at least one of [product_variant_id, product_id]"

// ❌ TEST 5: INVALID - ZERO QUANTITY
const TEST_INVALID_ZERO_QTY = {
  receiver_name: "Dương Văn E",
  phone: "0945678901",
  shipping_address: "111 Đường JKL, Gò Vấp, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 0  // ❌ Invalid quantity
    }
  ]
};
// Expected: VALIDATION ERROR - "Số lượng phải lớn hơn 0"

// ❌ TEST 6: INVALID - MISSING RECEIVER NAME
const TEST_INVALID_NO_NAME = {
  // receiver_name missing
  phone: "0956789012",
  shipping_address: "222 Đường MNO, Thủ Đức, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 1
    }
  ]
};
// Expected: VALIDATION ERROR - "Tên người nhận là bắt buộc"

// ❌ TEST 7: INVALID - MISSING PHONE
const TEST_INVALID_NO_PHONE = {
  receiver_name: "Lê Văn F",
  // phone missing
  shipping_address: "333 Đường PQR, Phú Nhuận, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 1
    }
  ]
};
// Expected: VALIDATION ERROR - "Số điện thoại là bắt buộc"

// ❌ TEST 8: INVALID - INVALID PAYMENT METHOD
const TEST_INVALID_PAYMENT = {
  receiver_name: "Ngô Văn G",
  phone: "0967890123",
  shipping_address: "444 Đường STU, Bình Tân, TP.HCM",
  payment_method: "CREDIT_CARD",  // ❌ Only COD, TRANSFER allowed
  items: [
    {
      product_variant_id: 5,
      quantity: 1
    }
  ]
};
// Expected: VALIDATION ERROR - "Phương thức thanh toán không hợp lệ"

// ❌ TEST 9: INVALID - NEGATIVE PRICE
const TEST_INVALID_NEGATIVE_PRICE = {
  receiver_name: "Trịnh Văn H",
  phone: "0978901234",
  shipping_address: "555 Đường VWX, Tây Hồ, TP.HCM",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,
      quantity: 1,
      unit_price: -100000,  // ❌ Negative price
      subtotal: -100000
    }
  ]
};
// Expected: VALIDATION ERROR - "Giá đơn vị không thể âm"

// ❌ TEST 10: INVALID - EMPTY ITEMS ARRAY
const TEST_INVALID_EMPTY_ITEMS = {
  receiver_name: "Hồ Văn I",
  phone: "0989012345",
  shipping_address: "666 Đường YZ Ab, Ba Đình, TP.HCM",
  payment_method: "COD",
  items: []  // ❌ Empty items
};
// Expected: VALIDATION ERROR - "Đơn hàng phải có ít nhất 1 sản phẩm"

// ============================================
// CURL COMMANDS FOR TESTING
// ============================================

/*
# TEST 1: Minimal valid - Replace TOKEN with actual JWT
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

# TEST 4: Invalid - Missing ID (should fail with validation error)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_name": "Test User",
    "phone": "0901234567",
    "shipping_address": "TP.HCM",
    "payment_method": "COD",
    "items": [
      {
        "quantity": 1
      }
    ]
  }'

# TEST 10: Empty items (should fail)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_name": "Test User",
    "phone": "0901234567",
    "shipping_address": "TP.HCM",
    "payment_method": "COD",
    "items": []
  }'
*/

// ============================================
// JAVASCRIPT FETCH EXAMPLES
// ============================================

async function testCheckoutMinimal(token) {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(TEST_MINIMAL_VALID)
  });
  const data = await response.json();
  console.log('Test 1 - Minimal Valid:', data);
}

async function testCheckoutInvalidNoId(token) {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(TEST_INVALID_NO_ID)
  });
  const data = await response.json();
  console.log('Test 4 - Invalid No ID:', data);
  // Should show: "must contain at least one of [product_variant_id, product_id]"
}

async function testCheckoutProductId(token) {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(TEST_WITH_PRODUCT_ID)
  });
  const data = await response.json();
  console.log('Test 3 - With Product ID:', data);
}

// ============================================
// POSTMAN COLLECTION IMPORT
// ============================================

/*
Import this into Postman as a Collection:

{
  "info": {
    "name": "Checkout Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Test 1 - Minimal Valid",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"receiver_name\": \"Test User\",\n  \"phone\": \"0901234567\",\n  \"shipping_address\": \"TP.HCM\",\n  \"payment_method\": \"COD\",\n  \"items\": [\n    {\n      \"product_variant_id\": 5,\n      \"quantity\": 1\n    }\n  ]\n}",
          "type": "application/json"
        },
        "url": {
          "raw": "http://localhost:5000/api/orders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "orders"]
        }
      }
    },
    {
      "name": "Test 4 - Invalid No ID",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"receiver_name\": \"Test User\",\n  \"phone\": \"0901234567\",\n  \"shipping_address\": \"TP.HCM\",\n  \"payment_method\": \"COD\",\n  \"items\": [\n    {\n      \"quantity\": 1\n    }\n  ]\n}",
          "type": "application/json"
        },
        "url": {
          "raw": "http://localhost:5000/api/orders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "orders"]
        }
      }
    }
  ]
}
*/

module.exports = {
  TEST_MINIMAL_VALID,
  TEST_COMPLETE_VALID,
  TEST_WITH_PRODUCT_ID,
  TEST_INVALID_NO_ID,
  TEST_INVALID_ZERO_QTY,
  TEST_INVALID_NO_NAME,
  TEST_INVALID_NO_PHONE,
  TEST_INVALID_PAYMENT,
  TEST_INVALID_NEGATIVE_PRICE,
  TEST_INVALID_EMPTY_ITEMS,
  testCheckoutMinimal,
  testCheckoutInvalidNoId,
  testCheckoutProductId
};
