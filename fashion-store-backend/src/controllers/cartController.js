const cartService = require('../services/cartService');
const { cleanCartByUserId } = require('../utils/cartCleaner');

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

/**
 * Làm sạch cart: loại bỏ items có variant không tồn tại hay bị ẩn
 */
const cleanCart = async (req, res, next) => {
  try {
    const result = await cleanCartByUserId(req.user.id);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Could not clean cart'
      });
    }
    res.json({
      success: true,
      message: result.message,
      data: {
        cleaned: result.cleaned,
        remaining: result.remaining,
        total_amount: result.total_amount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, cleanCart };
