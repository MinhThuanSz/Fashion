# ===== FASHION STORE BACKEND API TESTING SCRIPT =====
# PowerShell Script to test Order API endpoints
# Usage: .\test_checkout.ps1

Write-Host "🛒 Fashion Store Checkout Testing" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Base URL
$BASE_URL = "http://localhost:3000/api"

# ===== STEP 1: LOGIN =====
Write-Host "📋 STEP 1: Login to get token" -ForegroundColor Yellow
$loginBody = @{
    email    = "user@gmail.com"
    password = "123456"
} | ConvertTo-Json

Write-Host "Request: POST /auth/login"
Write-Host "Body: $loginBody" -ForegroundColor Gray

$loginResponse = Invoke-WebRequest -Uri "$BASE_URL/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody -ErrorAction SilentlyContinue

if ($loginResponse.StatusCode -eq 200) {
    Write-Host "✅ Login successful" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $TOKEN = $loginData.token
    $USER_ID = $loginData.user.id
    
    Write-Host "Token: $($TOKEN.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "User ID: $USER_ID" -ForegroundColor Gray
} else {
    Write-Host "❌ Login failed" -ForegroundColor Red
    Write-Host "Status: $($loginResponse.StatusCode)" -ForegroundColor Red
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ""

# ===== STEP 2: CREATE ORDER =====
Write-Host "📦 STEP 2: Create order" -ForegroundColor Yellow
$orderBody = @{
    receiver_name      = "Nguyễn Văn A"
    phone              = "0912345678"
    shipping_address   = "123 Đường ABC, TP.HCM"
    email              = "user@gmail.com"
    city               = "TP.HCM"
    note               = "Giao hàng trước 5pm"
    payment_method     = "COD"
    items              = @(
        @{
            product_variant_id = 1
            quantity           = 2
            unit_price         = 299000
        },
        @{
            product_variant_id = 2
            quantity           = 1
            unit_price         = 199000
        }
    )
} | ConvertTo-Json

Write-Host "Request: POST /orders" -ForegroundColor Yellow
Write-Host "Body:" -ForegroundColor Gray
Write-Host $orderBody -ForegroundColor Gray

try {
    $orderResponse = Invoke-WebRequest -Uri "$BASE_URL/orders" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $TOKEN" } `
        -Body $orderBody -ErrorAction Stop

    Write-Host "✅ Order created successfully" -ForegroundColor Green
    $orderData = $orderResponse.Content | ConvertFrom-Json
    $ORDER_ID = $orderData.order_id
    
    Write-Host "Order ID: $ORDER_ID" -ForegroundColor Green
    Write-Host "Message: $($orderData.message)" -ForegroundColor Green
    Write-Host "Total: $($orderData.order.total_amount)" -ForegroundColor Green
} catch {
    Write-Host "❌ Order creation failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    $errorBody = $_.Exception.Response.Content.ToString()
    Write-Host "Response: $errorBody" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ""

# ===== STEP 3: PROCESS PAYMENT =====
Write-Host "💳 STEP 3: Process payment for order #$ORDER_ID" -ForegroundColor Yellow

Write-Host "Request: POST /orders/$ORDER_ID/payment" -ForegroundColor Yellow

try {
    $paymentResponse = Invoke-WebRequest -Uri "$BASE_URL/orders/$ORDER_ID/payment" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $TOKEN" } `
        -ErrorAction Stop

    Write-Host "✅ Payment processed successfully" -ForegroundColor Green
    $paymentData = $paymentResponse.Content | ConvertFrom-Json
    
    Write-Host "Message: $($paymentData.message)" -ForegroundColor Green
    Write-Host "Payment Status: $($paymentData.payment_status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Payment processing failed" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    $errorBody = $_.Exception.Response.Content.ToString()
    Write-Host "Response: $errorBody" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ===== STEP 4: GET MY ORDERS =====
Write-Host "📋 STEP 4: Get user's orders" -ForegroundColor Yellow

Write-Host "Request: GET /orders/my-orders" -ForegroundColor Yellow

try {
    $myOrdersResponse = Invoke-WebRequest -Uri "$BASE_URL/orders/my-orders" `
        -Method GET `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $TOKEN" } `
        -ErrorAction Stop

    Write-Host "✅ Orders retrieved successfully" -ForegroundColor Green
    $myOrdersData = $myOrdersResponse.Content | ConvertFrom-Json
    
    Write-Host "Total Orders: $($myOrdersData.Length)" -ForegroundColor Green
    
    foreach ($order in $myOrdersData) {
        Write-Host "  - Order #$($order.id): $($order.total_amount) VND - Status: $($order.order_status)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to get orders" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ===== STEP 5: ADMIN - GET ALL ORDERS =====
Write-Host "👨‍💼 STEP 5: Admin - Get all orders" -ForegroundColor Yellow

Write-Host "Request: GET /orders (Admin)" -ForegroundColor Yellow
Write-Host "⚠️ Note: This requires admin token. Testing with current token..." -ForegroundColor Gray

try {
    $allOrdersResponse = Invoke-WebRequest -Uri "$BASE_URL/orders" `
        -Method GET `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $TOKEN" } `
        -ErrorAction Stop

    Write-Host "✅ All orders retrieved successfully" -ForegroundColor Green
    $allOrdersData = $allOrdersResponse.Content | ConvertFrom-Json
    
    Write-Host "Total Orders in System: $($allOrdersData.Length)" -ForegroundColor Green
    
    # Show last 3 orders
    Write-Host ""
    Write-Host "Recent Orders:" -ForegroundColor Cyan
    $allOrdersData | Select-Object -First 3 | ForEach-Object {
        Write-Host "  Order #$($_.id)" -ForegroundColor Green
        Write-Host "    Receiver: $($_.receiver_name)" -ForegroundColor Gray
        Write-Host "    Phone: $($_.phone)" -ForegroundColor Gray
        Write-Host "    Amount: $($_.total_amount) VND" -ForegroundColor Gray
        Write-Host "    Status: $($_.order_status)" -ForegroundColor Gray
        Write-Host "    Payment: $($_.payment_status)" -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "⚠️ Could not retrieve all orders (may require admin role)" -ForegroundColor Yellow
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Testing complete!" -ForegroundColor Green
Write-Host ""
