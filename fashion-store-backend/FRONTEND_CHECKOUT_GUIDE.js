/**
 * HƯỚNG DẪN SỬA FRONTEND CHECKOUT
 * ==============================
 * 
 * Tóm tắt vấn đề:
 * - Frontend đang gửi `items[].product_id` 
 * - Backend mong đợi `items[].product_variant_id`
 * 
 * Giải pháp: Frontend phải map cart item → order item đúng cách
 */

// ============================================
// 1. CHECKOUT PAGE - REACT CORRECT IMPLEMENTATION
// ============================================

/*
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutAPI } from '../services/api';

const CheckoutPage = () => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    receiver_name: '',
    phone: '',
    shipping_address: '',
    note: '',
    payment_method: 'COD'
  });

  // ✅ ĐÚNG: Map cart items → order items
  const prepareOrderPayload = () => {
    // Kiểm tra cart không rỗng
    if (!cart?.items || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống. Không thể tạo đơn hàng.');
    }

    // Map cart items → order items (QUAN TRỌNG)
    const items = cart.items.map(cartItem => {
      // Mỗi cartItem phải có product_variant_id (từ API GET /carts)
      if (!cartItem.product_variant_id) {
        throw new Error(
          `Sản phẩm bị lỗi: thiếu product_variant_id. ` +
          `Vui lòng reload giỏ hàng hoặc liên hệ hỗ trợ.`
        );
      }

      return {
        product_variant_id: cartItem.product_variant_id,  // ✅ ĐÂY LÀ KEY QUAN TRỌNG
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        subtotal: cartItem.subtotal
      };
    });

    return {
      receiver_name: formData.receiver_name,
      phone: formData.phone,
      shipping_address: formData.shipping_address,
      note: formData.note || '',
      payment_method: formData.payment_method,
      items: items
    };
  };

  // ✅ ĐÚNG: Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate form fields
      if (!formData.receiver_name?.trim()) {
        throw new Error('Vui lòng nhập tên người nhận.');
      }
      if (!formData.phone?.trim()) {
        throw new Error('Vui lòng nhập số điện thoại.');
      }
      if (!formData.shipping_address?.trim()) {
        throw new Error('Vui lòng nhập địa chỉ giao hàng.');
      }

      // Prepare payload
      const payload = prepareOrderPayload();

      // Call API
      const response = await checkoutAPI.createOrder(payload);

      if (response.success) {
        // Success
        alert('Đơn hàng của bạn đã được tạo thành công!');
        window.location.href = `/orders/${response.data.id}`;
      } else {
        throw new Error(response.message || 'Lỗi không xác định');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Thanh toán</h1>

      {error && (
        <div className="alert alert-danger">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên người nhận *</label>
          <input
            type="text"
            value={formData.receiver_name}
            onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
            placeholder="Nhập tên người nhận"
            required
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ giao hàng *</label>
          <textarea
            value={formData.shipping_address}
            onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
            placeholder="Nhập địa chỉ giao hàng"
            required
          />
        </div>

        <div className="form-group">
          <label>Ghi chú (tùy chọn)</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            placeholder="Nhập ghi chú"
          />
        </div>

        <div className="form-group">
          <label>Phương thức thanh toán *</label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
          >
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="TRANSFER">Chuyển khoản</option>
            <option value="CASH">Tiền mặt</option>
          </select>
        </div>

        <h2>Danh sách sản phẩm</h2>
        {cart?.items && (
          <table className="cart-items-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td>{item.variant?.Product?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price?.toLocaleString()}đ</td>
                  <td>{item.subtotal?.toLocaleString()}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="order-summary">
          <h3>Tổng tiền: {cart?.total_amount?.toLocaleString()}đ</h3>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
*/

// ============================================
// 2. API SERVICE - CHECKOUT API CALLS
// ============================================

/*
// services/checkoutAPI.js
export const checkoutAPI = {
  // ✅ Lấy giỏ hàng hiện tại
  async getCart() {
    const response = await fetch('/api/carts', {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!response.ok) throw new Error('Không thể lấy giỏ hàng');
    return response.json();
  },

  // ✅ Tạo order
  async createOrder(payload) {
    console.log('Sending checkout payload:', payload);  // Debug
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.message || 'Lỗi tạo đơn hàng');
    }

    return data;
  }
};
*/

// ============================================
// 3. ĐỀN CẢNH: LỖI PHỔ BIẾN
// ============================================

/*
❌ LỖI 1: Gửi product_id thay vì product_variant_id

// SAI
items: cart.items.map(item => ({
  product_id: item.product_id,             // ❌ SAI
  quantity: item.quantity,
  ...
}))

// ĐÚNG
items: cart.items.map(item => ({
  product_variant_id: item.product_variant_id,  // ✅ ĐÚNG
  quantity: item.quantity,
  ...
}))

---

❌ LỖI 2: Gửi thêm field không cần

// SAI
items: cart.items.map(item => ({
  product_variant_id: item.product_variant_id,
  product_id: item.product_id,             // ❌ Extra field
  variant: item.variant,                   // ❌ Extra field
  quantity: item.quantity,
  ...
}))

// ĐÚNG
items: cart.items.map(item => ({
  product_variant_id: item.product_variant_id,
  quantity: item.quantity,
  unit_price: item.unit_price,
  subtotal: item.subtotal
}))

---

❌ LỖI 3: Không có product_variant_id trong cart item

// SAI - Cart item từ API không có product_variant_id
{
  id: 1,
  cart_id: 1,
  // product_variant_id: MISSING ❌
  quantity: 2,
  ...
}

// ĐÚNG - Cart item phải có product_variant_id
{
  id: 1,
  cart_id: 1,
  product_variant_id: 5,   // ✅ CÓ
  quantity: 2,
  ...
}
*/

// ============================================
// 4. CORRECT CHECKOUT PAYLOAD EXAMPLE
// ============================================

const correctCheckoutPayload = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, Quận 1, TP.HCM",
  note: "Giao vào buổi chiều",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 1,      // ✅ KEY QUAN TRỌNG
      quantity: 2,
      unit_price: 1500000,        // Lấy từ cart.items
      subtotal: 3000000           // = unit_price * quantity
    },
    {
      product_variant_id: 5,      // ✅ Mỗi item phải có product_variant_id
      quantity: 1,
      unit_price: 2500000,
      subtotal: 2500000
    }
  ]
};

// ============================================
// 5. CÁCH LẤY CART ITEMS ĐỂ MAP
// ============================================

/*
// ✅ API GET /api/carts trả:
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "total_amount": 5500000,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "product_variant_id": 1,            // ← ĐÂY LÀ FIELD TÔI CẦN
        "quantity": 2,
        "unit_price": 1500000,              // ← Lấy giá từ đây
        "subtotal": 3000000,                // ← Lấy subtotal từ đây
        "variant": {
          "id": 1,
          "product_id": 1,
          "sku": "NIKE-AM270-1-5",
          "size_id": 9,
          "color_id": 2,
          "stock": 10,
          "Product": {
            "id": 1,
            "name": "Nike Air Max 270",
            ...
          }
        }
      },
      {
        "id": 2,
        "cart_id": 1,
        "product_variant_id": 5,            // ← ĐÂY LÀ FIELD TÔI CẦN
        "quantity": 1,
        "unit_price": 2500000,
        "subtotal": 2500000,
        "variant": {...}
      }
    ]
  }
}

// ✅ Frontend map từ cart items:
const items = cart.items.map(cartItem => ({
  product_variant_id: cartItem.product_variant_id,  // ← Từ đây
  quantity: cartItem.quantity,                      // ← Từ đây
  unit_price: cartItem.unit_price,                  // ← Từ đây
  subtotal: cartItem.subtotal                       // ← Từ đây
}));
*/

// ============================================
// 6. DEBUGGING TIP
// ============================================

/*
console.log('Cart items:', cart.items);
console.log('Order payload:', {
  receiver_name,
  phone,
  shipping_address,
  payment_method,
  items: cart.items.map(item => ({
    product_variant_id: item.product_variant_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal
  }))
});

// Nếu error, hãy kiểm tra:
// 1. product_variant_id có giá trị không?
// 2. quantity, unit_price, subtotal có đúng kiểu không?
// 3. Items array có rỗng không?
*/

// ============================================
// 7. TƯƠNG THÍCH VỚI BACKEND
// ============================================

/*
Backend hiện tại hỗ trợ cả:
1. product_variant_id (KHUYẾN NGHỊ) ✅
   - Map trực tiếp: item.product_variant_id → order_item.product_variant_id
   - Có đầy đủ thông tin variant (size, màu, ...)

2. product_id (FALLBACK)
   - Backend sẽ tìm variant đầu tiên của product
   - Có thể không đúng variant người dùng muốn
   - Không khuyến khích dùng

PHẢI DÙNG: product_variant_id
*/

// ============================================
// 8. ERROR HANDLING
// ============================================

/*
Nếu nhận error từ API, xử lý như sau:

1. "Mã sản phẩm phải là số nguyên"
   - product_variant_id gửi lên không phải number
   - Kiểm tra: parseInt(item.product_variant_id) === item.product_variant_id

2. "items[].product_id is not allowed"
   - Frontend gửi product_id nhưng không gửi product_variant_id hoặc quantity
   - Kiểm tra: cart item có product_variant_id không

3. "Sản phẩm không tồn tại"
   - product_variant_id lỏi trong DB
   - Kiểm tra: variant có tồn tại trong DB không

4. Validation Error với gợi ý
   "Gợi ý: Hãy kiểm tra lại giỏ hàng và đảm bảo gửi product_variant_id..."
   - Giỏ hàng bị lỗi,đầu cần reload giỏ
   - Thử: window.location.reload() hoặc fetch giỏ lại

ERROR RESPONSE:
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Mã biến thể sản phẩm phải là số nguyên",
    "items[0].product_id is not allowed",
    "..."
  ]
}

GOOD ERROR RESPONSE:
{
  "success": false,
  "message": "Không thể tạo đơn hàng",
  "error": "Sản phẩm (ID: 99) không còn tồn tại..."
}
*/

// ============================================
// 9. SUMMARY CHECKLIST
// ============================================

/*
Frontend Checkout Checklist:

✅ Lấy cart từ API
  - GET /api/carts
  - Kiểm tra cart.items không rỗng

✅ Map cart items → order items
  - product_variant_id: từ cartItem.product_variant_id
  - quantity: từ cartItem.quantity
  - unit_price: từ cartItem.unit_price
  - subtotal: từ cartItem.subtotal

✅ Validate form
  - receiver_name: không rỗng
  - phone: không rỗng
  - shipping_address: không rỗng
  - payment_method: valid value

✅ Submit order
  - POST /api/orders
  - Body: { receiver_name, phone, shipping_address, note, payment_method, items }

✅ Handle response
  - Success: Redirect to order detail page
  - Error: Display error message from API

✅ Never gửi:
  - product_id (sử dụng product_variant_id)
  - Extra fields không được định nghĩa
  - Null/undefined values cho required fields
*/
