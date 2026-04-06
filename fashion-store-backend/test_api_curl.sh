#!/bin/bash

# ============================================
# FASHION STORE - CURL TEST COMMANDS
# ============================================
# 
# Alternative to Postman - test via terminal
# Chạy: bash test_api_curl.sh
# 
# ============================================

BASE_URL="http://localhost:5000/api"
TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Fashion Store API Test ===${NC}\n"

# ============================================
# TEST 1: LOGIN
# ============================================
echo -e "${YELLOW}TEST 1: LOGIN${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get token${NC}\n"
  exit 1
else
  echo -e "${GREEN}✅ Token: ${TOKEN:0:30}...${NC}\n"
fi

# ============================================
# TEST 2: GET CART
# ============================================
echo -e "${YELLOW}TEST 2: GET CART${NC}"
curl -s -X GET "$BASE_URL/carts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Error"
echo ""

# ============================================
# TEST 3: ADD TO CART
# ============================================
echo -e "${YELLOW}TEST 3: ADD TO CART${NC}"
curl -s -X POST "$BASE_URL/carts/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_variant_id": 5,
    "quantity": 2
  }' | jq '.' || echo "Error"
echo ""

# ============================================
# TEST 4: CREATE ORDER - Minimal
# ============================================
echo -e "${YELLOW}TEST 4: CREATE ORDER - Minimal${NC}"
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }')

echo "Response: $ORDER_RESPONSE"
echo ""

# ============================================
# TEST 5: GET MY ORDERS
# ============================================
echo -e "${YELLOW}TEST 5: GET MY ORDERS${NC}"
curl -s -X GET "$BASE_URL/orders/my-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Error"
echo ""

# ============================================
# TEST 6: ERROR - Missing product ID
# ============================================
echo -e "${YELLOW}TEST 6: ERROR - Missing product ID${NC}"
curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
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
  }' | jq '.' || echo "Error"
echo ""

# ============================================
# TEST 7: ERROR - Invalid quantity
# ============================================
echo -e "${YELLOW}TEST 7: ERROR - Invalid quantity (0)${NC}"
curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.' || echo "Error"
echo ""

# ============================================
# TEST 8: ERROR - Insufficient stock
# ============================================
echo -e "${YELLOW}TEST 8: ERROR - Insufficient stock${NC}"
curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.' || echo "Error"
echo ""

echo -e "${GREEN}=== Test Complete ===${NC}"

# ============================================
# Windows PowerShell Version
# ============================================
# 
# $BASE_URL = "http://localhost:5000/api"
# 
# # TEST 1: LOGIN
# $login = Invoke-WebRequest -Uri "$BASE_URL/auth/login" `
#   -Method POST `
#   -ContentType "application/json" `
#   -Body '{"email":"user@example.com","password":"password123"}'
# 
# $token = ($login.Content | ConvertFrom-Json).data.token
# echo "Token: $token"
# 
# # TEST 2: GET CART
# Invoke-WebRequest -Uri "$BASE_URL/carts" `
#   -Method GET `
#   -Headers @{"Authorization"="Bearer $token"} | FormatTable
# 
# # TEST 3: ADD TO CART
# Invoke-WebRequest -Uri "$BASE_URL/carts/items" `
#   -Method POST `
#   -ContentType "application/json" `
#   -Headers @{"Authorization"="Bearer $token"} `
#   -Body '{"product_variant_id":5,"quantity":2}'



# ============================================
# Individual Test Commands (Copy & Paste)
# ============================================

# LOGIN
# curl -X POST http://localhost:5000/api/auth/login \
#   -H "Content-Type: application/json" \
#   -d '{"email":"user@example.com","password":"password123"}'

# GET CART (replace TOKEN)
# curl -X GET http://localhost:5000/api/carts \
#   -H "Authorization: Bearer TOKEN_HERE"

# CREATE ORDER (replace TOKEN)
# curl -X POST http://localhost:5000/api/orders \
#   -H "Authorization: Bearer TOKEN_HERE" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "receiver_name":"Test",
#     "phone":"0901234567",
#     "shipping_address":"TP.HCM",
#     "payment_method":"COD",
#     "items":[{"product_variant_id":5,"quantity":1}]
#   }'

# GET MY ORDERS (replace TOKEN)
# curl -X GET http://localhost:5000/api/orders/my-orders \
#   -H "Authorization: Bearer TOKEN_HERE"