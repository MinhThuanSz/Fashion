-- 1. Xóa chi tiết đơn hàng trước (Foreign Key constraint)
DELETE FROM order_items;

-- 2. Xóa đơn hàng sau
DELETE FROM orders;

-- 3. Reset Identity (Auto Increment) cho SQL Server
DBCC CHECKIDENT ('order_items', RESEED, 0);
DBCC CHECKIDENT ('orders', RESEED, 0);

PRINT '✅ All orders and order items have been cleared and identity reset.';
