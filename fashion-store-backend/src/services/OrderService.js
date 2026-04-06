const { Order, OrderItem, ProductVariant, Cart, CartItem, Product } = require('../database');
const { sequelize } = require('../config/db');

const OrderService = {
  async createOrder(userId, data) {
    const transaction = await sequelize.transaction();
    try {
      const receiver_name = (data.receiver_name || data.hoTen || '').toString().trim();
      const phone = (data.phone || '').toString().trim();
      const shipping_address = (data.shipping_address || '').toString().trim();
      const note = data.note || '';
      const payment_method = (data.payment_method || 'COD').toUpperCase();
      const items = data.items || [];

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
        let variantId = item.product_variant_id || item.productVariantId || item.variantId;
        let variant = await ProductVariant.findByPk(variantId);
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
      return { success: true, message: 'Order placed successfully', data: order };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  },

  async getMyOrders(userId) {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{ model: Product, as: 'product' }]
          }]
        }
      ],
      order: [['id', 'DESC']]
    });
    return orders;
  },

  async getOrderById(orderId, userId) {
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
    if (order.user_id !== userId && !this.isAdmin(userId)) {
      throw new Error('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  },

  async getAllOrders(limit = 10, offset = 0) {
    const { count, rows } = await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: ProductVariant, as: 'variant' }]
        }
      ],
      limit,
      offset,
      order: [['id', 'DESC']]
    });
    return { total: count, orders: rows };
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng');

    order.order_status = status;
    await order.save();
    return order;
  },

  async updatePaymentStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng');

    order.payment_status = status;
    await order.save();
    return order;
  },

  async cancelOrder(orderId, userId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    if (order.user_id !== userId) throw new Error('Bạn không có quyền hủy đơn hàng này');

    order.order_status = 'CANCELLED';
    await order.save();
    return order;
  }
};

module.exports = OrderService;
