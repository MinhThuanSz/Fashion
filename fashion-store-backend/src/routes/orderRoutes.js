const express = require('express');
const router = express.Router();
const { Order, OrderItem, ProductVariant, User, Cart, CartItem, Product } = require('../database');
const { sequelize } = require('../config/db');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = req.body;
    const userId = req.user.id;
    const receiver_name    = (data.receiver_name || data.hoTen || '').toString().trim();
    const phone            = (data.phone || '').toString().trim();
    const shipping_address = (data.shipping_address || '').toString().trim();
    const note             = data.note || '';
    const payment_method   = (data.payment_method || 'COD').toUpperCase();
    const items            = data.items || [];

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
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
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
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: ProductVariant, as: 'variant' }]
        }
      ]
    });

    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    
    // Fix: access Role via req.user.Role.name
    const isAdmin = req.user.Role && req.user.Role.name === 'Admin';
    if (order.userId !== req.user.id && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }
    res.json({ success: true, message: 'Order detail fetched', data: order });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    res.status(404).json({ success: false, message: error.message });
  }
});

// Admin routes
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'User', attributes: ['full_name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, message: 'All orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.order_status = status;
    if (payment_status) order.payment_status = payment_status;
    await order.save();
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
