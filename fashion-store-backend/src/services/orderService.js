const { Order, OrderItem, ProductVariant, User, Cart, CartItem, Product } = require('../models');
const { sequelize } = require('../config/db');

const getMyOrders = async (userId) => {
  try {
    return await Order.findAll({
      where: { userId: userId },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: ProductVariant, as: 'variant' }]
        }
      ],
      order: [['id', 'DESC']]
    });
  } catch (error) {
    console.error('Service getMyOrders Error:', error.message);
    throw error;
  }
};

const createOrder = async (userId, data) => {
  const receiver_name    = (data.receiver_name || data.hoTen || '').toString().trim();
  const phone            = (data.phone || '').toString().trim();
  const shipping_address = (data.shipping_address || '').toString().trim();
  const note             = data.note || '';
  const payment_method   = (data.payment_method || 'COD').toUpperCase();
  const items            = data.items || [];

  if (!userId) throw new Error('Vui lòng đăng nhập');
  
  const transaction = await sequelize.transaction();

  try {
    let orderItemsInput = items;
    let cart = null;

    if (orderItemsInput.length === 0) {
      cart = await Cart.findOne({ where: { user_id: userId }, include: [{ model: CartItem, as: 'items' }] });
      if (!cart || cart.items.length === 0) throw new Error('Giỏ hàng trống');
      orderItemsInput = cart.items.map(item => ({
        productVariantId: item.product_variant_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal
      }));
    }

    const resolvedItems = [];
    for (const item of orderItemsInput) {
      // Chấp nhận cả variantId (frontend mới) và product_variant_id (database/api cũ)
      let variantId = item.product_variant_id || item.productVariantId || item.variantId;
      let variant = await ProductVariant.findByPk(variantId);
      
      // Fallback cho dữ liệu Mock nếu không có variantId
      if (!variant && item.product_id) {
        variant = await ProductVariant.findOne({ where: { product_id: item.product_id } });
      }

      if (!variant) throw new Error('Sản phẩm không tồn tại trong hệ thống');

      resolvedItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: item.unit_price || item.unitPrice || 0,
        subtotal: item.subtotal || ((item.unit_price || item.unitPrice || 0) * item.quantity),
        variant
      });
    }

    const totalSpentInItems = resolvedItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
    // Ưu tiên total_amount từ Frontend (đã áp mã giảm giá rank), nếu không có mới dùng tổng tính từ items.
    const final_total_amount = data.total_amount ? Number(data.total_amount) : totalSpentInItems;

    const order = await Order.create({
      userId,
      receiver_name,
      phone,
      shipping_address,
      note,
      total_amount: final_total_amount,
      order_status: 'PENDING',
      payment_method,
      payment_status: 'UNPAID'
    }, { transaction });

    for (const item of resolvedItems) {
      await OrderItem.create({
        orderId: order.id,
        productVariantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }, { transaction });

      if (item.variant.stock >= item.quantity) {
        item.variant.stock -= item.quantity;
        await item.variant.save({ transaction });
      }
    }

    if (cart) await CartItem.destroy({ where: { cart_id: cart.id }, transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const getOrderById = async (orderId, userId, isAdmin) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: ProductVariant, as: 'variant' }]
      }
    ]
  });

  if (!order) throw new Error('Không tìm thấy đơn hàng');
  if (order.userId !== userId && !isAdmin) throw new Error('Không có quyền truy cập');
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
  const { OrderItem, User } = require('../models');
  return await Order.findAll({
    include: [
      { model: OrderItem, as: 'items' },
      { model: User, as: 'User', attributes: ['full_name', 'email', 'phone'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
