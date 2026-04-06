-- Roles
INSERT INTO roles (name, description) VALUES ('Admin', 'Administrator'), ('User', 'Standard User');

-- Users (Check passwords in models for hashing logic, these are placeholders for SQL seed)
INSERT INTO users (full_name, email, password, role_id, status) VALUES 
('Admin Account', 'admin@gmail.com', '$2b$10$YourHashedPasswordHere', 1, 1),
('User Account', 'user@gmail.com', '$2b$10$YourHashedPasswordHere', 2, 1);

-- Categories
INSERT INTO categories (name, description) VALUES 
(N'Áo', N'Các loại áo thời trang'), 
(N'Quần', N'Các loại quần thời trang'), 
(N'Giày', N'Giày thể thao và công sở');

-- Brands
INSERT INTO brands (name) VALUES ('Nike'), ('Adidas'), ('Puma');

-- Sizes
INSERT INTO sizes (name, type) VALUES ('S', 'CLOTHES'), ('M', 'CLOTHES'), ('L', 'CLOTHES'), ('39', 'SHOES'), ('40', 'SHOES'), ('41', 'SHOES'), ('42', 'SHOES');

-- Colors
INSERT INTO colors (name, hex_code) VALUES (N'Trắng', '#FFFFFF'), (N'Đen', '#000000'), (N'Đỏ', '#FF0000'), (N'Xanh', '#0000FF');

-- Sample Products
INSERT INTO products (name, slug, price, category_id, brand_id, gender) VALUES 
('Nike Air Max 270', 'nike-air-max-270', 3500000, 3, 1, 'Men'),
('Adidas Ultraboost', 'adidas-ultraboost', 4200000, 3, 2, 'Unisex'),
('Puma Classic T-Shirt', 'puma-classic-t-shirt', 500000, 1, 3, 'Men');

-- Product Variants
INSERT INTO product_variants (product_id, size_id, color_id, sku, stock) VALUES 
(1, 6, 2, 'NIKE-AM270-41-BLACK', 10),
(1, 7, 1, 'NIKE-AM270-42-WHITE', 5),
(3, 2, 2, 'PUMA-TEE-M-BLACK', 20);

-- Product Images
INSERT INTO product_images (product_id, image_url, is_main) VALUES 
(1, 'https://example.com/nike270.jpg', 1),
(2, 'https://example.com/ultraboost.jpg', 1),
(3, 'https://example.com/pumatee.jpg', 1);

-- Cart for users
INSERT INTO carts (user_id) VALUES (1), (2);
