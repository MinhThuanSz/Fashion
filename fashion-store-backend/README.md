# Fashion Store Backend (Node.js + SQL Server) - Version 2.0

Project backend hoàn chỉnh cho website bán quần áo và giày dép, được xây dựng theo kiến trúc chuẩn RESTful API, có đầy đủ validation và business logic.

## Công nghệ sử dụng
- **Node.js & Express.js**
- **SQL Server** (Dùng Sequelize ORM)
- **JWT** (JSON Web Token) cho Authentication
- **Bcryptjs** cho bảo mật mật khẩu
- **Joi** cho input validation

## Cấu trúc thư mục
- `src/config`: Cấu hình Database & Environment.
- `src/models`: Định nghĩa 13 models (Sequelize).
- `src/controllers`: Xử lý logic nghiệp vụ chi tiết.
- `src/routes`: Định nghĩa các endpoint API theo chuẩn RESTful.
- `src/middlewares`: Auth, Role protection, Input Validation, Error handling.
- `src/validations`: Định nghĩa các schema Joi cho dữ liệu đầu vào.

## Các API Chính (Mới)

### 1. Authentication & Profile
- `POST /api/auth/register`: Đăng ký người dùng (Validation email, password >= 6).
- `POST /api/auth/login`: Đăng nhập & nhận Token.
- `GET /api/auth/profile`: Lấy thông tin cá nhân.
- `PUT /api/auth/profile`: Cập nhật Profile.
- `PUT /api/auth/change-password`: Đổi mật khẩu.

### 2. Quản lý Users (Admin Only)
- `GET /api/users`: Danh sách tất cả người dùng.
- `GET /api/users/:id`: Xem chi tiết người dùng.
- `PUT /api/users/:id/status`: Khóa/Mở khóa tài khoản.
- `PUT /api/users/:id/role`: Phân quyền người dùng.

### 3. Quản lý Sản phẩm (Phân trang & Lọc)
- `GET /api/products`: Lấy danh sách (Query: `page`, `limit`, `category`, `brand`, `gender`, `min_price`, `max_price`).
- `GET /api/products/:id_or_slug`: Xem chi tiết kèm images, variants, category, brand.
- `POST /api/products`: Thêm sản phẩm (Admin).
- `PUT /api/products/:id`: Cập nhật sản phẩm.
- `DELETE /api/products/:id`: Xóa sản phẩm.

### 4. Quản lý Biến thể & Ảnh
- `GET /api/variants`: Lọc biến thể theo sản phẩm, màu sắc, kích thước.
- `POST /api/images`: Thêm ảnh sản phẩm (Admin).
- `PUT /api/images/:id/set-main`: Đặt ảnh đại diện chính.

### 5. Giỏ hàng & Đặt hàng
- `GET /api/cart`: Xem giỏ hàng cá nhân.
- `POST /api/cart/items`: Thêm item vào giỏ (Kiểm tra tồn kho).
- `PUT /api/cart/items/:id`: Cập nhật số lượng.
- `POST /api/orders`: Thanh toán đơn hàng (Trừ tồn kho, copy items, xóa giỏ hàng).
- `GET /api/orders/my-orders`: Lịch sử đơn hàng cá nhân.
- `PUT /api/orders/:id/status`: Cập nhật trạng thái đơn (Admin).

### 6. Admin Dashboard
- `GET /api/dashboard/summary`: Thống kê tổng số lượng User, Product, Order, Doanh thu và 5 đơn hàng mới nhất.

## Hướng dẫn cài đặt

1. **Database Setup**: Tạo database trong SQL Server.
2. **Cài đặt**: `npm install`.
3. **Cấu hình**: Sửa file `.env`.
4. **Seed dữ liệu**: `npm run seed` (Tạo bảng và dữ liệu mẫu).
5. **Chạy Project**: `npm run dev`.

