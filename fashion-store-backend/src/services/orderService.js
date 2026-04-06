const { Order, OrderItem, ProductVariant, Product, Cart, CartItem } = require('../models');
const { sequelize } = require('../config/db');

const createOrder = async (userId, data) => {
  // Mapping flexible names - Đảm bảo không trường nào bị undefined
  const receiver_name    = (data.receiver_name || data.hoTen || data.fullName || '').toString().trim();
  const phone            = (data.phone || data.soDienThoai || '').toString().trim();
  const shipping_address = (data.shipping_address || data.address || data.diaChi || '').toString().trim();
  const note             = data.note || '';
  const payment_method   = (data.payment_method || 'COD').toUpperCase();
  const items            = data.items || [];

  if (!userId) throw new Error('Yêu cầu đăng nhập để thực hiện đặt hàng.');
  if (!receiver_name || !phone || !shipping_address) throw new Error('Vui lòng cung cấp đầy đủ thông tin người nhận và địa chỉ.');

  const transaction = await sequelize.transaction();

  try {
    let orderItemsInput = items;
    let cart = null;

    if (orderItemsInput.length === 0) {
      cart = await Cart.findOne({ where: { user_id: userId }, include: [{ model: CartItem, as: 'items' }] });
      if (!cart || cart.items.length === 0) throw new Error('Giỏ hàng trống!');
      orderItemsInput = cart.items.map(item => ({
        product_variant_id: item.product_variant_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }));
    }

    const resolvedItems = [];
    for (const item of orderItemsInput) {
      let variant = null;
      if (item.product_variant_id) {
        variant = await ProductVariant.findByPk(item.product_variant_id);
      }
      
      // Fallback: Tìm variant đầu tiên của sản phẩm nếu không truyền variantId (dành cho dữ liệu mock)
      if (!variant && item.product_id) {
        variant = await ProductVariant.findOne({ 
          where: { product_id: item.product_id },
          order: [['id', 'ASC']] 
        });
      }

      if (!variant) throw new Error(`Sản phẩm (ID: ${item.product_id}) hiện không khả dụng trong hệ thống.`);

      resolvedItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unit_price: item.unit_price || 0,
        subtotal: item.subtotal || (item.unit_price * item.quantity),
        variant
      });
    }

    const total_amount = resolvedItems.reduce((acc, item) => acc + Number(item.subtotal), 0);

    // TẠO ORDER
    const order = await Order.create({
      userId: userId, // Dùng đúng thuộc tính userId đã sửa trong Model
      receiver_name,
      phone,
      shipping_address,
      note,
      total_amount,
      order_status: 'PENDING',
      payment_method,
      payment_status: 'UNPAID'
    }, { transaction });

    // TẠO ORDER ITEMS
    for (const item of resolvedItems) {
      await OrderItem.create({
        order_id: order.id,
        product_variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }, { transaction });

      // Trừ kho
      if (item.variant.stock >= item.quantity) {
        item.variant.stock -= item.quantity;
        await item.variant.save({ transaction });
      }
    }

    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
    }

    await transaction.commit();
    return order;
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('SERVER ORDER ERROR:', error);
    throw error;
  }
};

const getMyOrders = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']]
  });
};

const getOrderById = async (orderId, userId, isAdmin) => {
  const order = await Order.findByPk(orderId, { include: [{ model: OrderItem, as: 'items' }] });
  if (!order) throw new Error('Order not found');
  if (order.userId !== userId && !isAdmin) throw new Error('Not authorized');
  return order;
};

const updateOrderStatus = async (orderId, status, paymentStatus) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  order.order_status = status;
  if (paymentStatus) order.payment_status = paymentStatus;
  await order.save();
  return order;
};

const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      { model: OrderItem, as: 'items' },
      { model: require('../models').User, as: 'User', attributes: ['full_name', 'email', 'phone'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
