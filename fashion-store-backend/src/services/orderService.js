const { Order, OrderItem, ProductVariant, Product, Cart, CartItem } = require('../models');
const { sequelize } = require('../config/db');

const createOrder = async (userId, data) => {
  const receiver_name = data.receiver_name || data.hoTen || data.fullName || data.name;
  const phone = data.phone || data.sdt || data.phoneNumber;
  const shipping_address = data.shipping_address || data.address || data.diaChi;
  const note = data.note || '';
  const payment_method = data.payment_method || 'COD';
  const inputItems = data.items || [];

  const transaction = await sequelize.transaction();

  try {
    let orderItemsInput = inputItems;
    let cart = null;

    if (!orderItemsInput || orderItemsInput.length === 0) {
      cart = await Cart.findOne({ where: { user_id: userId }, include: [{ model: CartItem, as: 'items' }] });
      if (!cart || !cart.items || cart.items.length === 0) throw new Error('Giỏ hàng trống!');
      orderItemsInput = cart.items.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }));
    }

    const finalItems = [];
    for (const item of orderItemsInput) {
      // 1. Tìm variant ID tiềm năng
      let vId = item.product_variant_id || item.variant_id || item.variantId || item.id;
      
      // 2. Thử tìm trực tiếp variant theo ID này
      let variant = await ProductVariant.findByPk(vId);

      // 3. Nếu không thấy, có thể vId này thực chất là ProductID. Thử tìm variant đầu tiên của Product đó.
      if (!variant) {
        variant = await ProductVariant.findOne({ where: { product_id: vId } });
      }

      // 4. Nếu vẫn không thấy, thử tìm theo product_id được gửi riêng
      if (!variant && (item.product_id || item.productId)) {
        variant = await ProductVariant.findOne({ where: { product_id: item.product_id || item.productId } });
      }

      if (!variant) {
        throw new Error(`Sản phẩm (ID: ${vId || 'unknown'}) hiện không khả dụng trong hệ thống.`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Sản phẩm ${variant.sku} không đủ số lượng tồn kho.`);
      }

      const price = Number(item.unit_price || variant.extra_price || 0);
      finalItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: price,
        subtotal: Number(item.subtotal) || (price * item.quantity),
        variant
      });
    }

    const total_amount = finalItems.reduce((acc, i) => acc + Number(i.subtotal), 0);

    const order = await Order.create({
      userId: userId,
      receiver_name,
      phone,
      shipping_address,
      note,
      total_amount,
      order_status: 'PENDING',
      payment_method,
      payment_status: 'UNPAID'
    }, { transaction });

    for (const item of finalItems) {
      await OrderItem.create({
        orderId: order.id,
        productVariantId: item.variantId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal
      }, { transaction });

      item.variant.stock -= item.quantity;
      await item.variant.save({ transaction });
    }

    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
      cart.total_amount = 0;
      await cart.save({ transaction });
    }

    await transaction.commit();
    return order;
  } catch (error) {
    if (transaction) await transaction.rollback();
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
  if (!order) throw new Error('Không thấy đơn hàng');
  if (order.userId !== userId && !isAdmin) throw new Error('Từ chối');
  return order;
};

const updateOrderStatus = async (orderId, status, paymentStatus) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Không thấy đơn hàng');
  order.order_status = status;
  if (paymentStatus) order.payment_status = paymentStatus;
  if (status === 'SUCCESS' && order.payment_status !== 'PAID') order.payment_status = 'PAID';
  await order.save();
  return order;
};

const getAllOrders = async () => {
    const { User, OrderItem } = require('../models');
    return await Order.findAll({
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'User', attributes: ['full_name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
  };

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
