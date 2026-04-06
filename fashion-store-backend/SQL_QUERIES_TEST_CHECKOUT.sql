/**
 * SQL QUERIES: Kiểm tra dữ liệu sau khi sửa checkout
 */

-- ============================================
-- 1. KIỂM TRA DỮ LIỆU BAN ĐẦU
-- ============================================

-- Xem variants có sẵn
SELECT TOP 10 id, sku, stock, status FROM product_variants ORDER BY id;

-- Xem carts của user
SELECT id, user_id, total_amount FROM carts WHERE user_id IN (2, 3, 4, 5);

-- Xem cart items hiện tại
SELECT ci.id, ci.cart_id, ci.product_variant_id, ci.quantity, 
       ci.unit_price, ci.subtotal, pv.sku, pv.status
FROM cart_items ci
LEFT JOIN product_variants pv ON ci.product_variant_id = pv.id
ORDER BY ci.created_at DESC;

-- ============================================
-- 2. KIỂM TRA SAU KHI CHECKOUT
-- ============================================

-- Xem orders vừa tạo
SELECT id, user_id, receiver_name, phone, total_amount, 
       order_status, payment_status, created_at
FROM orders
WHERE created_at > DATEADD(HOUR, -1, GETDATE())
ORDER BY created_at DESC;

-- Xem order items của order mới nhất
SELECT oi.id, oi.order_id, oi.product_variant_id, oi.quantity,
       oi.unit_price, oi.subtotal, pv.sku
FROM order_items oi
LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
WHERE oi.order_id IN (
  SELECT TOP 5 id FROM orders ORDER BY created_at DESC
)
ORDER BY oi.created_at DESC;

-- Xem stock vẫn sau checkout
SELECT id, sku, stock FROM product_variants 
WHERE id IN (1, 2, 3, 4, 5)
ORDER BY id;

-- ============================================
-- 3. KIỂM TRA CART SAU CHECKOUT
-- ============================================

-- Xem cart của user vừa checkout
SELECT id, user_id, total_amount FROM carts WHERE user_id = 2;

-- Xem items còn lại trong cart
SELECT * FROM cart_items WHERE cart_id = 1;

-- ============================================
-- 4. KIỂM TRA DỮ LIỆU LỖI (để test error handling)
-- ============================================

-- Tạo cart item với variant không tồn tại (để test error)
INSERT INTO cart_items (cart_id, product_variant_id, quantity, unit_price, subtotal)
VALUES (1, 99999, 1, 100000, 100000);

-- Kiểm tra
SELECT * FROM cart_items WHERE product_variant_id = 99999;

-- ============================================
-- 5. CLEANUP: XÓA DỮ LIỆU TEST
-- ============================================

-- Xóa cart items lỗi
DELETE FROM cart_items WHERE product_variant_id NOT IN (SELECT id FROM product_variants);

-- Xóa orders trong 1 giờ rồi (nếu cần reset)
DELETE FROM order_items 
WHERE order_id IN (
  SELECT id FROM orders 
  WHERE created_at > DATEADD(HOUR, -1, GETDATE())
);

DELETE FROM orders 
WHERE created_at > DATEADD(HOUR, -1, GETDATE());

-- Reset stock về ban đầu (run seed.sql lại)
-- hoặc cập nhật stock theo seed.sql

-- ============================================
-- 6. SUMMARY QUERIES
-- ============================================

-- Thống kê orders
SELECT 
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  order_status
FROM orders
GROUP BY order_status;

-- Thống kê cart items
SELECT COUNT(*) as total_items, SUM(quantity) as total_quantity
FROM cart_items;

-- Kiểm tra variants bị ẩn
SELECT id, sku, status FROM product_variants WHERE status = 0;

-- Kiểm tra cart items mà variant không tồn tại (orphaned)
SELECT ci.* FROM cart_items ci
LEFT JOIN product_variants pv ON ci.product_variant_id = pv.id
WHERE pv.id IS NULL;
