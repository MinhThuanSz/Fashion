const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, cleanCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { cartItemSchema } = require('../validations/productValidation');

router.get('/', protect, getCart);
router.post('/items', protect, validate(cartItemSchema), addToCart);
router.put('/items/:id', protect, validate(cartItemSchema), updateCartItem);
router.delete('/items/:id', protect, removeFromCart);
router.post('/clean', protect, cleanCart);
router.delete('/', protect, clearCart);

module.exports = router;
