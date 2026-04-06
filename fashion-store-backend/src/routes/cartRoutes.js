const express = require('express');
const router = express.Router();
const { Cart, CartItem, ProductVariant, Product, ProductImage } = require('../database');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem, as: 'items',
        include: [{
          model: ProductVariant, as: 'variant',
          include: [{ model: Product, include: [{ model: ProductImage, as: 'images', where: { is_main: true }, required: false }] }]
        }]
      }]
    });
    res.json({ success: true, message: 'Cart fetched', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { product_variant_id, quantity } = req.body;
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    const variant = await ProductVariant.findByPk(product_variant_id, {
      include: { model: Product, attributes: ['price', 'discount_price'] }
    });

    if (!variant || (variant.stock < quantity)) {
      return res.status(400).json({ success: false, message: 'Sản phẩm hết hàng hoặc số lượng không hợp lệ' });
    }

    const price = variant.Product.discount_price || variant.Product.price;
    const existingItem = await CartItem.findOne({ where: { cart_id: cart.id, product_variant_id } });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = price * existingItem.quantity;
      await existingItem.save();
    } else {
      await CartItem.create({ cart_id: cart.id, product_variant_id, quantity, unit_price: price, subtotal: price * quantity });
    }

    const items = await CartItem.findAll({ where: { cart_id: cart.id } });
    cart.total_amount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
    await cart.save();

    res.json({ success: true, message: 'Item added to cart', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/item/:id', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    item.quantity = quantity;
    item.subtotal = item.unit_price * quantity;
    await item.save();

    const cart = await Cart.findByPk(item.cart_id);
    const items = await CartItem.findAll({ where: { cart_id: cart.id } });
    cart.total_amount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
    await cart.save();

    res.json({ success: true, message: 'Cart updated', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/item/:id', protect, async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const cartId = item.cart_id;
    await item.destroy();

    const cart = await Cart.findByPk(cartId);
    const items = await CartItem.findAll({ where: { cart_id: cartId } });
    cart.total_amount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
    await cart.save();

    res.json({ success: true, message: 'Item removed', data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    await CartItem.destroy({ where: { cart_id: cart.id } });
    cart.total_amount = 0;
    await cart.save();
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
