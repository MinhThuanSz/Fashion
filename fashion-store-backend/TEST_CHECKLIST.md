# POSTMAN TEST CHECKLIST ✅

## CHUẨN BỊ
- [ ] Backend server running? `npm start`
- [ ] Database kết nối? Check DB logs
- [ ] Postman cài? https://www.postman.com/downloads/
- [ ] Mở Postman

## SETUP ENVIRONMENT
- [ ] Tạo Environment: `FashionStore`
- [ ] Set: `BASE_URL = http://localhost:5000/api`
- [ ] Set: `TOKEN = ` (sẽ fill sau login)

## IMPORT COLLECTION ⭐
**Option 1: Quick Import**
1. File → Import → Choose File
2. Select: `fashion-store-checkout-collection.json`
3. Click "Import"

**Option 2: Paste Raw**
1. File → Import → Raw Text
2. Paste từ `POSTMAN_TEST_COLLECTION.js`
3. Click "Import"

---

# TEST EXECUTION SEQUENCE

## Phase 1: AUTHENTICATION ✅
- [ ] **TEST 1:** LOGIN
  - POST `/auth/login`
  - Body: email + password valid
  - Expected: 200 OK + token
  - **Action:** Copy token → Set {{TOKEN}} variable

## Phase 2: CART OPERATIONS ✅
- [ ] **TEST 2:** GET CART
  - GET `/carts`
  - Header: Bearer {{TOKEN}}
  - Expected: 200 OK
  - **Check:** product_variant_id visible?

- [ ] **TEST 3:** ADD TO CART
  - POST `/carts/items`
  - Body: `product_variant_id`: 5, `quantity`: 2
  - Expected: 200 OK
  - **Check:** Item added to cart?

- [ ] **TEST 4:** UPDATE CART
  - PUT `/carts/items/1`
  - Body: `quantity`: 3
  - Expected: 200 OK
  - **Check:** Quantity updated?

- [ ] **TEST 5:** REMOVE FROM CART
  - DELETE `/carts/items/1`
  - Expected: 200 OK
  - **Check:** Item removed?

- [ ] **TEST 6:** CLEAN CART
  - POST `/carts/clean`
  - Expected: 200 OK
  - **Check:** Invalid items cleaned?

## Phase 3: ORDER CREATION (MAIN) ✅⭐
- [ ] **TEST 7:** CREATE ORDER - Minimal
  - POST `/orders`
  - Minimal payload (only product_variant_id)
  - Expected: **201 Created** (NOT 200!)
  - **Check:** 
    - Order ID returned?
    - Order status = PENDING?
    - Payment status = UNPAID?
  - **Action:** Save order ID for later tests

- [ ] **TEST 8:** CREATE ORDER - Full Payload
  - POST `/orders`
  - Full payload with unit_price + subtotal
  - Expected: **201 Created**
  - **Check:** 
    - Multiple items created?
    - Prices match?
    - Total calculated correctly?

- [ ] **TEST 9:** CREATE ORDER - Using product_id
  - POST `/orders`
  - Use `product_id` instead of `product_variant_id`
  - Expected: **201 Created**
  - **Check:** Backend found variant automatically?

## Phase 4: VALIDATION ERROR CASES ❌
Testing that backend rejects bad requests:

- [ ] **TEST 10:** Missing product ID
  - POST `/orders` without product_variant_id AND product_id
  - Expected: **400 Bad Request**
  - Check error message: "Mỗi sản phẩm phải có..."

- [ ] **TEST 11:** Invalid quantity (0)
  - POST `/orders` with `quantity: 0`
  - Expected: **400 Bad Request**
  - Check error message: "Số lượng phải lớn hơn 0"

- [ ] **TEST 12:** Missing receiver_name
  - POST `/orders` without receiver_name
  - Expected: **400 Bad Request**
  - Check error message: "Tên người nhận là bắt buộc"

- [ ] **TEST 13:** Missing phone
  - POST `/orders` without phone
  - Expected: **400 Bad Request**
  - Check error message: "Số điện thoại là bắt buộc"

- [ ] **TEST 14:** Empty items
  - POST `/orders` with `items: []`
  - Expected: **400 Bad Request**
  - Check error message: "Đơn hàng phải có ít nhất 1 sản phẩm"

- [ ] **TEST 15:** Invalid payment method
  - POST `/orders` with `payment_method: "CRYPTO"`
  - Expected: **400 Bad Request**
  - Check error message: "Phương thức thanh toán không hợp lệ"
  - Check valid methods in hint

- [ ] **TEST 16:** Insufficient stock
  - POST `/orders` with `quantity: 999` (more than stock)
  - Expected: **400 Bad Request**
  - Check error message: "Sản phẩm chỉ còn X cái trong kho"

## Phase 5: RETRIEVE ORDERS ✅
- [ ] **TEST 17:** GET MY ORDERS
  - GET `/orders/my-orders`
  - Expected: 200 OK
  - **Check:** 
    - List returned?
    - Order created in Phase 3 appears?
    - Status = PENDING?

- [ ] **TEST 18:** GET ORDER BY ID
  - GET `/orders/{{ORDER_ID}}`
  - Expected: 200 OK
  - **Check:** 
    - Full order details?
    - Items list?
    - Prices correct?

## Phase 6: ADMIN OPERATIONS (Optional) ⭐
*Only if you have admin account*

- [ ] **TEST 19:** UPDATE ORDER STATUS (Admin)
  - PUT `/orders/{{ORDER_ID}}/status`
  - Body: `status: "SHIPPED"`, `payment_status: "PAID"`
  - Expected: 200 OK
  - **Check:** Status updated in DB?

- [ ] **TEST 20:** GET ALL ORDERS (Admin)
  - GET `/orders` (no /my-orders)
  - Expected: 200 OK
  - **Check:** All orders from all users?

---

# EXPECTED STATUS CODES

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Login | 200 | ? | ⚠️ |
| Get Cart | 200 | ? | ⚠️ |
| Add Cart | 200 | ? | ⚠️ |
| Create Order | **201** | ? | ⚠️ |
| Get My Orders | 200 | ? | ⚠️ |
| Error Tests | 400 | ? | ⚠️ |

---

# DATABASE VERIFICATION

After each successful order creation, verify DB:

```sql
-- Check orders created
SELECT * FROM orders ORDER BY created_at DESC;

-- Check order items
SELECT * FROM order_items ORDER BY created_at DESC;

-- Check stock decremented
SELECT p.name, pv.size, pv.color, pv.stock 
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.id = 5;

-- Check cart cleared
SELECT * FROM carts WHERE user_id = 45;
```

---

# COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Token expired | Re-login (TEST 1) |
| 404 Not Found | product_variant_id không tồn tại | Check variant ID in DB |
| 400 Validation Error | Payload format sai | Copy từ test case đúng |
| 500 Server Error | Backend crash | Check server logs |
| Stock Error | quantity > variant.stock | Reduce quantity |
| Missing price | unit_price not provided | Backend tính tự động |
| Cart not cleared | Order creation failed | Check error message trước |

---

# SCORING

✅ **Perfect (20/20):**
- All tests pass
- All validations work
- All errors have messages
- Order appears in DB

✅ **Good (15/20):**
- Core tests pass (1-9)
- Some error tests fail

⚠️ **Needs Work:**
- Any core test fails (1-9)
- Create order returns 200 instead of 201
- No error messages

---

# NOTES
- Keep {{TOKEN}} updated after each login
- {{ORDER_ID}} auto-saved from TEST 7
- {{ADMIN_TOKEN}} set manually for admin tests
- All timestamps in UTC (DB)
- Stock updates in real-time

---

# SUCCESS CRITERIA ✨

**Checkout flow is COMPLETE when:**
1. ✅ Can login (TEST 1)
2. ✅ Can view cart (TEST 2)
3. ✅ Can create order (TEST 7) → 201 status
4. ✅ Order saved in DB (TEST 17)
5. ✅ Stock decremented (DB check)
6. ✅ Validation errors returned correctly (TEST 10-16)

**ALL 6 = ✅ READY FOR PRODUCTION** 🚀
