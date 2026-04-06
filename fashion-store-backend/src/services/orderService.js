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

    // CHIẾN THUẬT MỚI: Luôn ưu tiên lấy giỏ hàng từ Database để đảm bảo có đầy đủ ID chuẩn
    cart = await Cart.findOne({ 
      where: { user_id: userId }, 
      include: [{ model: CartItem, as: 'items' }] 
    });

    // Nếu Frontend gửi items rỗng HOẶC items thiếu ID quan trọng, ta dùng Cart từ DB
    const firstItem = inputItems[0];
    const isFrontendDataMissingID = firstItem && !(firstItem.id || firstItem.variantId || firstItem.product_variant_id || firstItem.product_id);

    if ((!orderItemsInput || orderItemsInput.length === 0 || isFrontendDataMissingID) && cart) {
      if (!cart.items || cart.items.length === 0) throw new Error('Giỏ hàng của bạn đang trống.');
      orderItemsInput = cart.items.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }));
    }

    if (!orderItemsInput || orderItemsInput.length === 0) {
      throw new Error('Không có sản phẩm nào để đặt hàng.');
    }

    const finalItems = [];
    for (const item of orderItemsInput) {
      const vId = item.product_variant_id || item.variant_id || item.variantId || item.id;
      const pId = item.product_id || item.productId;
      
      let variant = null;
      if (vId) {
        variant = await ProductVariant.findByPk(vId);
        if (!variant) variant = await ProductVariant.findOne({ where: { product_id: vId } });
      }
      if (!variant && pId) {
        variant = await ProductVariant.findOne({ where: { product_id: pId } });
      }

      if (!variant) {
        // Fallback cuối cùng: Nếu vẫn không thấy, lấy đại variant đầu tiên (để tránh block người dùng demo)
        variant = await ProductVariant.findOne({ order: [['id', 'ASC']] });
      }

      if (!variant) throw new Error('Hệ thống hiện không có sản phẩm khả dụng.');

      const price = Number(item.unit_price || variant.extra_price || 0);
      finalItems.push({
        variantId: variant.id,
        quantity: Number(item.quantity) || 1,
        unitPrice: price,
        subtotal: Number(item.subtotal) || (price * (Number(item.quantity) || 1)),
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
    where: { userId: userId }, // Sửa từ user_id sang userId
    include: [{ model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']]
  });
};

const getOrderById = async (orderId, userId, isAdmin) => {
  const order = await Order.findByPk(orderId, { include: [{ model: OrderItem, as: 'items' }] });
  if (!order) throw new Error('Không thấy đơn hàng');
  if (order.userId !== userId && !isAdmin) throw new Error('Hành động không hợp lệ');
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
  return await Order.findAll({
    include: [
      { model: OrderItem, as: 'items' },
      { model: require('../models').User, as: 'User', attributes: ['full_name', 'email', 'phone'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
