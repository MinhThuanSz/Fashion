/**
 * SIMPLE ORDER SERVICE - For demo purposes
 * Simplified logic: create order without complex validation
 */

const { Order, OrderItem, Product, Cart, CartItem } = require('../models');
const { sequelize } = require('../config/db');

/**
 * Create order - SIMPLIFIED VERSION FOR DEMO
 * Input: userId, { receiver_name, phone, shipping_address, items, ... }
 * Output: created order
 */
const createOrder = async (userId, data) => {
  const { 
    receiver_name, 
    phone, 
    shipping_address, 
    email,
    city,
    note, 
    payment_method = 'COD',
    items = [] 
  } = data;

  try {
    // ===== 1. VALIDATE INPUT =====
    if (!receiver_name || !phone || !shipping_address) {
      throw new Error('Vui lòng nhập đầy đủ thông tin giao hàng');
    }

    if (!items || items.length === 0) {
      throw new Error('Đơn hàng không có sản phẩm');
    }

    // ===== 2. CALCULATE TOTAL =====
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const quantity = parseInt(item.quantity) || 1;
      const price = parseFloat(item.unit_price) || 0;
      const subtotal = quantity * price;
      
      total_amount += subtotal;

      orderItems.push({
        product_variant_id: item.product_variant_id || null,
        product_id: item.product_id || null,
        quantity,
        unit_price: price,
        subtotal
      });
    }

    // ===== 3. CREATE ORDER =====
    const order = await Order.create({
      user_id: userId,
      receiver_name: receiver_name.trim(),
      phone: phone.trim(),
      shipping_address: shipping_address.trim(),
      email: email || null,
      city: city || null,
      note: note || null,
      total_amount: total_amount || 0,
      order_status: 'PENDING',
      payment_method: payment_method || 'COD',
      payment_status: 'UNPAID'
    });

    console.log(`✅ Order created: #${order.id}`);

    // ===== 4. CREATE ORDER ITEMS =====
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        product_variant_id: item.product_variant_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      });
    }

    console.log(`✅ Order items created: ${items.length} items`);

    // ===== 5. CLEAR CART (Optional) =====
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (cart) {
        await CartItem.destroy({ where: { cart_id: cart.id } });
        cart.total_amount = 0;
        await cart.save();
        console.log(`✅ Cart cleared`);
      }
    } catch (err) {
      console.log('⚠️ Could not clear cart:', err.message);
    }

    return {
      success: true,
      message: 'Đặt hàng thành công',
      order_id: order.id,
      order: order
    };

  } catch (error) {
    console.error('❌ Order creation error:', error.message);
    throw new Error(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
  }
};

/**
 * Get my orders (user side)
 */
const getMyOrders = async (userId) => {
  try {
    return await Order.findAll({
      where: { user_id: userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn hàng');
  }
};

/**
 * Get order by ID
 */
const getOrderById = async (orderId, userId, isAdmin = false) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) throw new Error('Đơn hàng không tồn tại');
    
    if (order.user_id !== userId && !isAdmin) {
      throw new Error('Không có quyền truy cập đơn hàng này');
    }

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy chi tiết đơn hàng');
  }
};

/**
 * Get all orders (admin)
 */
const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn hàng');
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status, paymentStatus) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Đơn hàng không tồn tại');
    
    if (status) order.order_status = status;
    if (paymentStatus) order.payment_status = paymentStatus;
    
    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể cập nhật đơn hàng');
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
