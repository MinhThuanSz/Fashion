/**
 * HƯỚNG DẪN: Sửa luồng Checkout cho Frontend
 * ========================================
 * 
 * File này mô tả cách sửa checkout page để xử lý error đúng cách
 * và đồng bộ dữ liệu giỏ hàng với backend.
 */

// ============================================
// 1. CHECKOUT SERVICE / API CALL (React)
// ============================================

/**
 * Sửa API call để checkout:
 * - Call clean cart trước (loại bỏ item lỗi)
 * - Fetch cart mới từ backend (lấy dữ liệu chuẩn)
 * - Gửi order dengan dữ liệu đã xác thực
 */

// services/api.js hoặc services/checkoutService.js
export const checkoutAPI = {
  /**
   * Làm sạch cart (loại bỏ item lỗi)
   */
  async cleanCart() {
    try {
      const response = await fetch('/api/carts/clean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể làm sạch giỏ hàng');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Clean cart error:', error);
      throw error;
    }
  },

  /**
   * Lấy giỏ hàng mới nhất từ backend (refreshCart)
   */
  async fetchCart() {
    try {
      const response = await fetch('/api/carts', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy giỏ hàng');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch cart error:', error);
      throw error;
    }
  },

  /**
   * Tạo order
   */
  async createOrder(orderData) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Lỗi khi tạo đơn hàng');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }
};

// ============================================
// 2. CHECKOUT PAGE COMPONENT (React)
// ============================================

/**
 * CheckoutPage.jsx - Sửa để xử lý error đúng cách
 */

/*
import React, { useState, useEffect } from 'react';
import { checkoutAPI } from '../services/api';

const CheckoutPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    receiver_name: '',
    phone: '',
    shipping_address: '',
    note: '',
    payment_method: 'COD'
  });

  // 1. MOUNT: Làm sạch cart + Lấy cart mới
  useEffect(() => {
    initializeCheckout();
  }, []);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Bước 1: Làm sạch cart (loại bỏ item lỗi)
      try {
        const cleanResult = await checkoutAPI.cleanCart();
        if (cleanResult.data?.cleaned > 0) {
          console.log(`Đã loại bỏ ${cleanResult.data.cleaned} item lỗi khỏi giỏ`);
        }
      } catch (cleanError) {
        // Không throw error nếu clean cart thất bại
        // Vì user có thể chỉ có item hợp lệ
        console.warn('Clean cart warning:', cleanError.message);
      }

      // Bước 2: Lấy cart mới từ backend
      const cartResponse = await checkoutAPI.fetchCart();
      if (!cartResponse.success || !cartResponse.data) {
        throw new Error('Không thể lấy dữ liệu giỏ hàng');
      }

      const cart = cartResponse.data;
      
      // Kiểm tra giỏ hàng có item không
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Giỏ hàng của bạn rỗng. Vui lòng thêm sản phẩm trước khi thanh toán.');
      }

      // Validate items
      if (cart.items.some(item => !item.product_variant_id || !item.variant)) {
        throw new Error('Một số sản phẩm trong giỏ hàng bị hỏng. Vui lòng reload trang.');
      }

      setCartData(cart);
      setError(null);
    } catch (err) {
      setError({
        type: 'danger',
        title: 'Lỗi',
        message: err.message || 'Lỗi khi tải dữ liệu checkout'
      });
      setCartData(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. SUBMIT: Tạo order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate form
      if (!formData.receiver_name?.trim()) {
        throw new Error('Vui lòng nhập tên người nhận');
      }
      if (!formData.phone?.trim()) {
        throw new Error('Vui lòng nhập số điện thoại');
      }
      if (!formData.shipping_address?.trim()) {
        throw new Error('Vui lòng nhập địa chỉ giao hàng');
      }

      // Prepare order data
      const orderData = {
        receiver_name: formData.receiver_name,
        phone: formData.phone,
        shipping_address: formData.shipping_address,
        note: formData.note,
        payment_method: formData.payment_method,
        items: cartData.items.map(item => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal
        }))
      };

      // Submit order
      const response = await checkoutAPI.createOrder(orderData);
      
      if (response.success) {
        // Success
        setError({
          type: 'success',
          title: 'Thành công',
          message: 'Đơn hàng của bạn đã được tạo. Chúng tôi sẽ liên hệ bạn sớm.'
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = `/orders/${response.data.id}`;
        }, 2000);
      }
    } catch (err) {
      setError({
        type: 'danger',
        title: 'Lỗi tạo đơn hàng',
        message: err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. RENDER
  if (loading && !cartData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="checkout-page">
      {/* Error Alert */}
      {error && (
        <div className={`alert alert-${error.type}`}>
          <h4>{error.title}</h4>
          <p>{error.message}</p>
          
          {error.type === 'danger' && (
            <div>
              <button onClick={initializeCheckout} style={{marginRight: '10px'}}>
                Tải lại
              </button>
              <a href="/cart">Quay lại giỏ hàng</a>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {cartData && (
        <form onSubmit={handleSubmitOrder}>
          <h2>Thông tin giao hàng</h2>
          
          <input
            type="text"
            placeholder="Tên địa chỉ"
            value={formData.receiver_name}
            onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
            required
          />

          <input
            type="tel"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />

          <textarea
            placeholder="Địa chỉ giao hàng"
            value={formData.shipping_address}
            onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
            required
          />

          <textarea
            placeholder="Ghi chú (tùy chọn)"
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
          />

          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
          >
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="TRANSFER">Chuyển khoản</option>
            <option value="CASH">Tiền mặt</option>
          </select>

          <h2>Sản phẩm</h2>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {cartData.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.variant?.Product?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price?.toLocaleString()} đ</td>
                  <td>{item.subtotal?.toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Tổng tiền: {cartData.total_amount?.toLocaleString()} đ</h3>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;
*/

// ============================================
// 3. RHO REDUX / CONTEXT (nếu sử dụng)
// ============================================

/**
 * Nếu dùng Redux:
 * - Dispatch action FETCH_CART_SUCCESS khi lấy cart mới
 * - Dispatch action CLEAN_CART_SUCCESS khi làm sạch
 * - Không lưu cache cũ vào state during checkout
 */

// ============================================
// 4. ERROR HANDLING BEST PRACTICES
// ============================================

/*
Các loại error và cách xử lý:

1. Cart rỗng
   - Hiển thị: "Giỏ hàng của bạn rỗng"
   - Action: Link quay lại shop

2. Variant không tồn tại
   - Hiển thị: "Một số sản phẩm không còn khả dụng"  
   - Action: Nút clean cart + refresh

3. Stock không đủ
   - Hiển thị: "Chỉ còn X cái, bạn muốn Y cái"
   - Action: Quay lại cart để điều chỉnh

4. Validation error từ form
   - Hiển thị: Lỗi input cụ thể
   - Action: Highlight field lỗi

5. API error
   - Hiển thị: "Lỗi hệ thống. Vui lòng thử lại"
   - Action: Nút retry

6. Timeout / Network error
   - Hiển thị: "Mất kết nối. Vui lòng kiểm tra internet"
   - Action: Nút retry
*/
