#!/bin/bash

# ============================================
# CHECKOUT API TEST SCENARIOS
# ============================================
# Chú ý: 
# - Thay đổi TOKEN bằng JWT token thực của user
# - Thay đổi BASE_URL nếu server khác
# - Chạy từng lệnh một hoặc chạy script: bash api_test_checkout.sh

# ============================================
# CONFIGURATION
# ============================================

BASE_URL="http://localhost:3000/api"
TOKEN="your_jwt_token_here"  # Thay bằng token thực
HEADERS_JSON="Content-Type: application/json"
HEADERS_AUTH="Authorization: Bearer $TOKEN"

# User ID từ seed data
USER_ID="2"

# ============================================
# HELPER FUNCTIONS
# ============================================

print_header() {
  echo ""
  echo "=========================================="
  echo "🧪 TEST: $1"
  echo "=========================================="
}

print_result() {
  echo -e "\n✓ Response:"
  echo "$1" | python3 -m json.tool 2>/dev/null || echo "$1"
}

# ============================================
# TEST 1: Get Cart (kiểm tra giỏ hiện tại)
# ============================================

test_get_cart() {
  print_header "Get Cart"
  
  response=$(curl -s -X GET "$BASE_URL/carts" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH")
  
  print_result "$response"
}

# ============================================
# TEST 2: Add to Cart - Valid Variant
# ============================================

test_add_valid_item() {
  print_header "Add Valid Item to Cart (Variant ID: 1)"
  
  response=$(curl -s -X POST "$BASE_URL/carts/items" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "product_variant_id": 1,
      "quantity": 2
    }')
  
  print_result "$response"
}

# ============================================
# TEST 3: Add to Cart - Invalid Variant
# ============================================

test_add_invalid_item() {
  print_header "Add Invalid Item (Variant ID: 99999)"
  
  response=$(curl -s -X POST "$BASE_URL/carts/items" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "product_variant_id": 99999,
      "quantity": 1
    }')
  
  print_result "$response"
  echo "✓ Expected: Error 400 - 'Sản phẩm không tồn tại'"
}

# ============================================
# TEST 4: Add to Cart - Excessive Quantity
# ============================================

test_add_excessive_qty() {
  print_header "Add Item with Excessive Quantity"
  
  response=$(curl -s -X POST "$BASE_URL/carts/items" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "product_variant_id": 1,
      "quantity": 9999
    }')
  
  print_result "$response"
  echo "✓ Expected: Error 400 - 'Chỉ còn X cái'"
}

# ============================================
# TEST 5: Create Order - Success (Happy Path)
# ============================================

test_checkout_success() {
  print_header "Create Order - Success"
  
  response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "receiver_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "shipping_address": "123 Đường 1, TP.HCM",
      "note": "Giao vào buổi chiều",
      "payment_method": "COD",
      "items": [
        {
          "product_variant_id": 1,
          "quantity": 1,
          "unit_price": 3150000,
          "subtotal": 3150000
        }
      ]
    }')
  
  print_result "$response"
  echo "✓ Expected: Success 201 - Order created"
}

# ============================================
# TEST 6: Create Order - Variant Not Found
# ============================================

test_checkout_variant_not_found() {
  print_header "Create Order - Variant Not Found"
  
  response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "receiver_name": "Nguyễn Văn B",
      "phone": "0987654321",
      "shipping_address": "456 Đường 2, TP.HCM",
      "payment_method": "COD",
      "items": [
        {
          "product_variant_id": 99999,
          "quantity": 1,
          "unit_price": 1000000,
          "subtotal": 1000000
        }
      ]
    }')
  
  print_result "$response"
  echo "✓ Expected: Error 400 - 'Sản phẩm không tồn tại'"
}

# ============================================
# TEST 7: Create Order - Insufficient Stock
# ============================================

test_checkout_insufficient_stock() {
  print_header "Create Order - Insufficient Stock"
  
  response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "receiver_name": "Nguyễn Văn C",
      "phone": "0911111111",
      "shipping_address": "789 Đường 3, TP.HCM",
      "payment_method": "COD",
      "items": [
        {
          "product_variant_id": 1,
          "quantity": 9999,
          "unit_price": 3150000,
          "subtotal": 31496500000
        }
      ]
    }')
  
  print_result "$response"
  echo "✓ Expected: Error 400 - 'Chỉ còn X cái'"
}

# ============================================
# TEST 8: Create Order - Missing Required Fields
# ============================================

test_checkout_missing_fields() {
  print_header "Create Order - Missing Required Fields"
  
  response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH" \
    -d '{
      "receiver_name": "",
      "phone": "",
      "shipping_address": "",
      "payment_method": "COD",
      "items": []
    }')
  
  print_result "$response"
  echo "✓ Expected: Error 400 - Validation errors"
}

# ============================================
# TEST 9: Clean Cart
# ============================================

test_clean_cart() {
  print_header "Clean Cart (Remove Invalid Items)"
  
  response=$(curl -s -X POST "$BASE_URL/carts/clean" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH")
  
  print_result "$response"
  echo "✓ Expected: Success - Invalid items removed"
}

# ============================================
# TEST 10: Get My Orders
# ============================================

test_get_my_orders() {
  print_header "Get My Orders"
  
  response=$(curl -s -X GET "$BASE_URL/orders/my-orders" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH")
  
  print_result "$response"
}

# ============================================
# TEST 11: Get Order Detail
# ============================================

test_get_order_detail() {
  print_header "Get Order Detail (Order ID: 1)"
  
  response=$(curl -s -X GET "$BASE_URL/orders/1" \
    -H "$HEADERS_JSON" \
    -H "$HEADERS_AUTH")
  
  print_result "$response"
}

# ============================================
# RUN ALL TESTS
# ============================================

run_all_tests() {
  echo "=================================="
  echo "🚀 RUNNING ALL CHECKOUT TESTS"
  echo "=================================="
  
  test_get_cart
  test_add_valid_item
  test_add_invalid_item
  test_add_excessive_qty
  test_clean_cart
  test_get_cart
  test_checkout_success
  test_checkout_variant_not_found
  test_checkout_insufficient_stock
  test_checkout_missing_fields
  test_get_my_orders
  test_get_order_detail
  
  echo ""
  echo "=================================="
  echo "✓ ALL TESTS COMPLETED"
  echo "=================================="
}

# ============================================
# MAIN: Parse arguments
# ============================================

if [ $# -eq 0 ]; then
  run_all_tests
else
  case "$1" in
    get_cart)        test_get_cart ;;
    add_valid)       test_add_valid_item ;;
    add_invalid)     test_add_invalid_item ;;
    add_excessive)   test_add_excessive_qty ;;
    checkout_ok)     test_checkout_success ;;
    checkout_not_found) test_checkout_variant_not_found ;;
    checkout_stock)  test_checkout_insufficient_stock ;;
    checkout_missing) test_checkout_missing_fields ;;
    clean)           test_clean_cart ;;
    orders)          test_get_my_orders ;;
    order_detail)    test_get_order_detail ;;
    all)             run_all_tests ;;
    *)               echo "Unknown test: $1"; exit 1 ;;
  esac
fi

# ============================================
# USAGE
# ============================================
cat << 'EOF'

📖 USAGE:
  bash api_test_checkout.sh [test_name]

AVAILABLE TESTS:
  - get_cart          : Lấy giỏ hàng hiện tại
  - add_valid         : Thêm item hợp lệ
  - add_invalid       : Thêm item không tồn tại
  - add_excessive     : Thêm quá nhiều item
  - checkout_ok       : Checkout thành công
  - checkout_not_found: Checkout - variant không tồn tại
  - checkout_stock    : Checkout - hết stock
  - checkout_missing  : Checkout - thiếu trường
  - clean             : Làm sạch cart
  - orders            : Lấy danh sách đơn hàng
  - order_detail      : Lấy chi tiết đơn hàng
  - all               : Chạy tất cả tests

EXAMPLES:
  bash api_test_checkout.sh get_cart
  bash api_test_checkout.sh checkout_ok
  bash api_test_checkout.sh all

🔑 IMPORTANT:
  1. Thay đổi TOKEN bằng JWT token thực
  2. Thay đổi BASE_URL nếu server khác port
  3. Chạy seed.js trước: node seed.js
EOF
