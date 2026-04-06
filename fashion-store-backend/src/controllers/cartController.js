const cartService = require('../services/cartService');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUserId(req.user.id);
    res.json({ success: true, message: 'Cart fetched', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addItemToCart(req.user.id, req.body);
    res.json({ success: true, message: 'Item added to cart', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateItemQuantity(req.params.id, req.body.quantity);
    res.json({ success: true, message: 'Cart updated', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.params.id);
    res.json({ success: true, message: 'Item removed', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCartByUserId(req.user.id);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
