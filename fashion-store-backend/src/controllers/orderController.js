const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id, 
      req.user.id, 
      req.user.Role.name === 'Admin'
    );
    res.json({ success: true, message: 'Order detail fetched', data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id, 
      req.body.status, 
      req.body.payment_status
    );
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, message: 'All orders fetched', data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// PAYMENT PROCESSING - One Click Payment ⚡
// ========================================
const processPayment = async (req, res, next) => {
  try {
    const result = await orderService.processPayment(
      req.params.id,
      req.user.id
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderStatus, 
  getAllOrders,
  processPayment 
};
