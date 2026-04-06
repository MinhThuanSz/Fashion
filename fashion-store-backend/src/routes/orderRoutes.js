const express = require('express');
const router = express.Router();
const { User, Order, OrderItem, ProductVariant } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');
const OrderService = require('../services/OrderService');

router.post('/', protect, async (req, res) => {
  try {
    const result = await OrderService.createOrder(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await OrderService.getMyOrders(req.user.id);
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const isAdmin = req.user.Role && req.user.Role.name === 'Admin';
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
    if (order.user_id !== req.user.id && !isAdmin) {
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
    const { limit = 10, offset = 0 } = req.query;
    const data = await OrderService.getAllOrders(parseInt(limit), parseInt(offset));
    res.json({ success: true, message: 'All orders fetched', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const order = await OrderService.updateOrderStatus(req.params.id, status);
    if (payment_status) {
      await OrderService.updatePaymentStatus(req.params.id, payment_status);
    }
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
