-- ================================================
-- SEED DATA FOR FASHION STORE DATABASE
-- ================================================

-- 1. ROLES
INSERT INTO roles (name, description) VALUES 
('Admin', 'Quản trị viên hệ thống'), 
('User', 'Người dùng thường');

-- 2. USERS
INSERT INTO users (full_name, email, password, phone, address, role_id, status) VALUES 
('Nguyễn Văn Admin', 'admin@fashionstore.com', '$2b$10$YourHashedPasswordHere', '0912345678', '123 Đường 3/2, Quận 1, TP.HCM', 1, 1),
('Trần Thị Nguyễn', 'nguyen@gmail.com', '$2b$10$YourHashedPasswordHere', '0987654321', '456 Nguyễn Huệ, Quận 1, TP.HCM', 2, 1),
('Lê Văn Long', 'long.le@gmail.com', '$2b$10$YourHashedPasswordHere', '0911223344', '789 Trần Hưng Đạo, Quận 5, TP.HCM', 2, 1),
('Phạm Thị Mai', 'mai.pham@yahoo.com', '$2b$10$YourHashedPasswordHere', '0988776655', '321 Lý Tự Trọng, Quận 1, TP.HCM', 2, 1),
('Vũ Hải Minh', 'minh.vu@gmail.com', '$2b$10$YourHashedPasswordHere', '0933445566', '654 Cách Mạng Tháng 8, Quận 3, TP.HCM', 2, 1);

-- 3. CATEGORIES
INSERT INTO categories (name, description, status) VALUES 
(N'Áo Nam', N'Tất cả các loại áo cho nam giới từ áo thun đến áo sơ mi', 1), 
(N'Áo Nữ', N'Áo nữ thời trang, áo crop, áo sơ mi nữ', 1),
(N'Quần Nam', N'Quần jean, quần khaki, quần tây dành cho nam', 1),
(N'Quần Nữ', N'Quần jean nữ, legging, quần tây nữ', 1),
(N'Giày', N'Giày thể thao, giày công sở, dép', 1),
(N'Phụ Kiện', N'Mũ, tất, khăn và các phụ kiện khác', 1);

-- 4. BRANDS
INSERT INTO brands (name, description, status) VALUES 
('Nike', 'Nike - Thương hiệu thể thao hàng đầu thế giới', 1), 
('Adidas', 'Adidas - Thiết bị thể thao chất lượng cao', 1), 
('Puma', 'Puma - Thương hiệu thời trang và thể thao', 1),
('Tommy Hilfiger', 'Tommy Hilfiger - Thời trang cao cấp từ Mỹ', 1),
('Calvin Klein', 'Calvin Klein - Thương hiệu thối trang nổi tiếng', 1),
('Local Brand', 'Thương hiệu định hướng địa phương', 1);

-- 5. SIZES
INSERT INTO sizes (name, type, status) VALUES 
('XS', 'CLOTHES', 1), 
('S', 'CLOTHES', 1), 
('M', 'CLOTHES', 1), 
('L', 'CLOTHES', 1), 
('XL', 'CLOTHES', 1),
('XXL', 'CLOTHES', 1),
('37', 'SHOES', 1), 
('38', 'SHOES', 1), 
('39', 'SHOES', 1), 
('40', 'SHOES', 1), 
('41', 'SHOES', 1), 
('42', 'SHOES', 1),
('43', 'SHOES', 1);

-- 6. COLORS
INSERT INTO colors (name, hex_code, status) VALUES 
(N'Trắng', '#FFFFFF', 1), 
(N'Đen', '#000000', 1), 
(N'Đỏ', '#FF0000', 1), 
(N'Xanh Navy', '#000080', 1),
(N'Xanh Nhạt', '#87CEEB', 1),
(N'Xám', '#808080', 1),
(N'Vàng', '#FFFF00', 1),
(N'Cam', '#FFA500', 1),
(N'Tím', '#800080', 1),
(N'Hồng', '#FFC0CB', 1);

-- 7. PRODUCTS
INSERT INTO products (name, slug, description, price, discount_price, gender, material, category_id, brand_id, status) VALUES 
(N'Nike Air Max 270', 'nike-air-max-270', N'Giày thể thao cao cấp với công nghệ Air Max mới nhất', 3500000, 3150000, 'Men', N'Vải + Cao Su', 5, 1, 1),
(N'Adidas Ultraboost 22', 'adidas-ultraboost-22', N'Giày chạy bộ công nghệ Boost tiên tiến', 4200000, 3780000, 'Men', N'Vải Lưới + Cao Su', 5, 2, 1),
(N'Puma RS-X Toys', 'puma-rs-x-toys', N'Giày thể thao retro với thiết kế độc đáo', 2800000, 2520000, 'Unisex', N'Vải + Neoprene', 5, 3, 1),
(N'Tommy Hilfiger Basic T-Shirt', 'tommy-hilfiger-tshirt', N'Áo thun cơ bản màu sắc tươi sáng', 450000, 360000, 'Men', N'100% Cotton', 1, 4, 1),
(N'Calvin Klein Logo T-Shirt', 'calvin-klein-tshirt', N'Áo thun có logo Calvin Klein nổi bật', 650000, 520000, 'Men', N'100% Cotton', 1, 5, 1),
(N'Adidas Running T-Shirt', 'adidas-running-tshirt', N'Áo chạy bộ thoáng khí Adidas', 550000, 440000, 'Men', N'Vải Polytester', 1, 2, 1),
(N'LEVI''S 501 Jean', 'levis-501-jeans', N'Quần jean kinh điển LEVI''S dùng lâu bền', 1200000, 900000, 'Men', N'100% Denim Cotton', 3, 6, 1),
(N'Adidas Slim Fit Chinos', 'adidas-chinos', N'Quần kaki ôm dáng phù hợp công sở', 850000, 680000, 'Men', N'Cotton + Elastane', 3, 2, 1),
(N'Nike Flex Training Shorts', 'nike-shorts', N'Quần short tập luyện thoáng mát', 450000, 315000, 'Men', N'Vải Poliester', 3, 1, 1),
(N'Basic White Women''s T-Shirt', 'basic-white-tshirt-women', N'Áo thun trắng đơn giản cho nữ', 300000, 210000, 'Women', N'100% Cotton', 2, 6, 1),
(N'Black Sports Crop Top', 'black-crop-top', N'Áo crop đen cho yoga và thể thao', 400000, 280000, 'Women', N'Vải Co Giãn', 2, 1, 1),
(N'Adidas Women''s Legging', 'adidas-legging', N'Legging thể thao thoải mái và bền', 650000, 520000, 'Women', N'Vải Co Giãn Nylon', 4, 2, 1),
(N'Blue Jeans Women', 'blue-jeans-women', N'Quần jean xanh nữ kiểu dáng thanh lịch', 950000, 760000, 'Women', N'100% Denim Cotton', 4, 6, 1),
(N'Nike Wool Socks', 'nike-wool-socks', N'Vớ len chống nước giữ ấm chân', 150000, 120000, 'Unisex', N'Len Merino', 6, 1, 1),
(N'Classic Baseball Cap', 'classic-baseball-cap', N'Mũ lưỡi trai kinh điển', 250000, 175000, 'Unisex', N'Cotton Canvas', 6, 6, 1);

-- 8. PRODUCT VARIANTS
INSERT INTO product_variants (product_id, size_id, color_id, sku, stock, extra_price, status) VALUES 
-- Nike Air Max 270
(1, 9, 2, 'NIKE-AM270-39-BLK', 15, 0, 1),
(1, 10, 2, 'NIKE-AM270-40-BLK', 12, 0, 1),
(1, 11, 2, 'NIKE-AM270-41-BLK', 8, 0, 1),
(1, 11, 1, 'NIKE-AM270-41-WHT', 5, 0, 1),
(1, 12, 1, 'NIKE-AM270-42-WHT', 6, 0, 1),
-- Adidas Ultraboost 22
(2, 9, 2, 'ADIDAS-UB22-39-BLK', 10, 0, 1),
(2, 10, 2, 'ADIDAS-UB22-40-BLK', 14, 0, 1),
(2, 11, 4, 'ADIDAS-UB22-41-NAVY', 7, 0, 1),
(2, 12, 1, 'ADIDAS-UB22-42-WHT', 5, 0, 1),
-- Puma RS-X Toys
(3, 8, 1, 'PUMA-RSX-38-WHT', 20, 0, 1),
(3, 9, 2, 'PUMA-RSX-39-BLK', 18, 0, 1),
(3, 10, 3, 'PUMA-RSX-40-RED', 12, 0, 1),
-- Tommy Hilfiger Basic T-Shirt
(4, 2, 1, 'TOMMY-TEE-S-WHT', 30, 0, 1),
(4, 3, 1, 'TOMMY-TEE-M-WHT', 25, 0, 1),
(4, 4, 1, 'TOMMY-TEE-L-WHT', 20, 0, 1),
(4, 3, 2, 'TOMMY-TEE-M-BLK', 22, 0, 1),
(4, 3, 4, 'TOMMY-TEE-M-NAVY', 18, 0, 1),
-- Calvin Klein Logo T-Shirt
(5, 2, 1, 'CK-TEE-S-WHT', 40, 0, 1),
(5, 3, 1, 'CK-TEE-M-WHT', 35, 0, 1),
(5, 4, 1, 'CK-TEE-L-WHT', 30, 0, 1),
(5, 5, 2, 'CK-TEE-XL-BLK', 15, 0, 1),
-- Adidas Running T-Shirt
(6, 2, 4, 'ADIDAS-RUN-S-NAVY', 25, 0, 1),
(6, 3, 4, 'ADIDAS-RUN-M-NAVY', 30, 0, 1),
(6, 4, 4, 'ADIDAS-RUN-L-NAVY', 20, 0, 1),
(6, 3, 5, 'ADIDAS-RUN-M-BLUE', 18, 0, 1),
-- LEVI'S 501 Jeans
(7, 2, 2, 'LEVIS-501-S-BLK', 12, 0, 1),
(7, 3, 2, 'LEVIS-501-M-BLK', 20, 0, 1),
(7, 4, 2, 'LEVIS-501-L-BLK', 15, 0, 1),
(7, 5, 2, 'LEVIS-501-XL-BLK', 8, 0, 1),
-- Adidas Slim Fit Chinos
(8, 2, 6, 'ADIDAS-CHI-S-GRY', 10, 0, 1),
(8, 3, 6, 'ADIDAS-CHI-M-GRY', 18, 0, 1),
(8, 4, 6, 'ADIDAS-CHI-L-GRY', 14, 0, 1),
(8, 3, 4, 'ADIDAS-CHI-M-NAVY', 16, 0, 1),
-- Nike Flex Training Shorts
(9, 2, 2, 'NIKE-SHORT-S-BLK', 20, 0, 1),
(9, 3, 2, 'NIKE-SHORT-M-BLK', 28, 0, 1),
(9, 4, 2, 'NIKE-SHORT-L-BLK', 25, 0, 1),
(9, 3, 3, 'NIKE-SHORT-M-RED', 15, 0, 1),
-- Basic White Women's T-Shirt
(10, 1, 1, 'BASIC-W-XS-WHT', 35, 0, 1),
(10, 2, 1, 'BASIC-W-S-WHT', 40, 0, 1),
(10, 3, 1, 'BASIC-W-M-WHT', 45, 0, 1),
-- Black Sports Crop Top
(11, 2, 2, 'CROP-TOP-S-BLK', 25, 0, 1),
(11, 3, 2, 'CROP-TOP-M-BLK', 30, 0, 1),
(11, 4, 2, 'CROP-TOP-L-BLK', 20, 0, 1),
-- Adidas Women's Legging
(12, 2, 2, 'ADIDAS-LEG-S-BLK', 22, 0, 1),
(12, 3, 2, 'ADIDAS-LEG-M-BLK', 28, 0, 1),
(12, 4, 2, 'ADIDAS-LEG-L-BLK', 18, 0, 1),
(12, 3, 4, 'ADIDAS-LEG-M-NAVY', 20, 0, 1),
-- Blue Jeans Women
(13, 2, 5, 'JEANS-W-S-BLU', 18, 0, 1),
(13, 3, 5, 'JEANS-W-M-BLU', 25, 0, 1),
(13, 4, 5, 'JEANS-W-L-BLU', 20, 0, 1),
-- Nike Wool Socks
(14, 3, 1, 'SOCK-WOOL-M-WHT', 50, 0, 1),
(14, 3, 2, 'SOCK-WOOL-M-BLK', 45, 0, 1),
-- Classic Baseball Cap
(15, 3, 1, 'CAP-CLASSIC-WHT', 35, 0, 1),
(15, 3, 2, 'CAP-CLASSIC-BLK', 40, 0, 1),
(15, 3, 4, 'CAP-CLASSIC-NAVY', 30, 0, 1);

-- 9. PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES 
(1, 'https://example.com/products/nike-air-max-270-1.jpg', 1, 1),
(1, 'https://example.com/products/nike-air-max-270-2.jpg', 0, 2),
(2, 'https://example.com/products/adidas-ultraboost-22-1.jpg', 1, 1),
(2, 'https://example.com/products/adidas-ultraboost-22-2.jpg', 0, 2),
(3, 'https://example.com/products/puma-rs-x-1.jpg', 1, 1),
(4, 'https://example.com/products/tommy-tshirt-1.jpg', 1, 1),
(5, 'https://example.com/products/calvin-klein-tshirt-1.jpg', 1, 1),
(6, 'https://example.com/products/adidas-running-tshirt-1.jpg', 1, 1),
(7, 'https://example.com/products/levis-501-jeans-1.jpg', 1, 1),
(8, 'https://example.com/products/adidas-chinos-1.jpg', 1, 1),
(9, 'https://example.com/products/nike-shorts-1.jpg', 1, 1),
(10, 'https://example.com/products/basic-tshirt-women-1.jpg', 1, 1),
(11, 'https://example.com/products/crop-top-1.jpg', 1, 1),
(12, 'https://example.com/products/adidas-legging-1.jpg', 1, 1),
(13, 'https://example.com/products/blue-jeans-women-1.jpg', 1, 1),
(14, 'https://example.com/products/nike-socks-1.jpg', 1, 1),
(15, 'https://example.com/products/baseball-cap-1.jpg', 1, 1);

-- 10. CARTS
INSERT INTO carts (user_id, total_amount, status) VALUES 
(2, 0, 1), 
(3, 0, 1), 
(4, 0, 1), 
(5, 0, 1);

-- 11. CART ITEMS (Add sample items to carts)
INSERT INTO cart_items (cart_id, product_variant_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 1, 3500000, 3500000),
(1, 15, 2, 450000, 900000),
(2, 5, 1, 4200000, 4200000),
(3, 22, 1, 1200000, 1200000),
(3, 31, 2, 300000, 600000);

-- 12. ORDERS
INSERT INTO orders (user_id, receiver_name, phone, shipping_address, note, total_amount, order_status, payment_method, payment_status) VALUES 
(2, N'Trần Thị Nguyễn', '0987654321', N'456 Nguyễn Huệ, Quận 1, TP.HCM', N'Giao vào buổi chiều sau 2h', 4500000, 'COMPLETED', 'TRANSFER', 'PAID'),
(3, N'Lê Văn Long', '0911223344', N'789 Trần Hưng Đạo, Quận 5, TP.HCM', N'Giao nhanh', 2800000, 'CONFIRMED', 'COD', 'UNPAID'),
(4, N'Phạm Thị Mai', '0988776655', N'321 Lý Tự Trọng, Quận 1, TP.HCM', NULL, 3200000, 'PENDING', 'TRANSFER', 'UNPAID'),
(2, N'Trần Thị Nguyễn', '0987654321', N'456 Nguyễn Huệ, Quận 1, TP.HCM', N'Giao khi tôi về nhà', 1550000, 'SHIPPING', 'COD', 'UNPAID'),
(5, N'Vũ Hải Minh', '0933445566', N'654 Cách Mạng Tháng 8, Quận 3, TP.HCM', N'Vui lòng gọi trước khi giao', 2100000, 'COMPLETED', 'TRANSFER', 'PAID');

-- 13. ORDER ITEMS
INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 1, 3500000, 3500000),
(1, 15, 2, 450000, 900000),
(2, 5, 1, 4200000, 4200000),
(2, 38, 1, 850000, 850000),
(2, 39, 2, 450000, 900000),
(3, 22, 2, 1200000, 2400000),
(3, 31, 1, 300000, 300000),
(3, 45, 2, 250000, 500000),
(4, 40, 1, 650000, 650000),
(4, 32, 2, 300000, 600000),
(4, 44, 1, 150000, 150000),
(4, 45, 1, 250000, 250000),
(5, 12, 1, 4200000, 4200000),
(5, 28, 1, 450000, 450000),
(5, 31, 2, 300000, 600000);
