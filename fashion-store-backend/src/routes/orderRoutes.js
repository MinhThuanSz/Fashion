const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, processPayment } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { orderSchema } = require('../validations/productValidation');

router.post('/', protect, validate(orderSchema), createOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/payment', protect, processPayment); // ⭐ PAYMENT ENDPOINT
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
