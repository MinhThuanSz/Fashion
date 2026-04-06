const { Cart, CartItem, ProductVariant, Product, ProductImage } = require('../models');

const getCartByUserId = async (userId) => {
  return await Cart.findOne({
    where: { user_id: userId },
    include: [{
      model: CartItem, as: 'items',
      include: [{
        model: ProductVariant, as: 'variant',
        include: [{ model: Product, include: [{ model: ProductImage, as: 'images', where: { is_main: true }, required: false }] }]
      }]
    }]
  });
};

const addItemToCart = async (userId, data) => {
  const { product_variant_id, quantity } = data;
  const cart = await Cart.findOne({ where: { user_id: userId } });
  const variant = await ProductVariant.findByPk(product_variant_id, {
    include: { model: Product, attributes: ['price', 'discount_price'] }
  });

  if (!variant || (variant.stock < quantity)) throw new Error('Sản phẩm hết hàng hoặc số lượng không hợp lệ');

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
  return cart;
};

const updateItemQuantity = async (itemId, quantity) => {
  const item = await CartItem.findByPk(itemId);
  if (!item) throw new Error('Item not found');
  item.quantity = quantity;
  item.subtotal = item.unit_price * quantity;
  await item.save();

  const cart = await Cart.findByPk(item.cart_id);
  const items = await CartItem.findAll({ where: { cart_id: cart.id } });
  cart.total_amount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  await cart.save();
  return cart;
};

const removeItem = async (itemId) => {
  const item = await CartItem.findByPk(itemId);
  if (!item) throw new Error('Item not found');
  const cartId = item.cart_id;
  await item.destroy();

  const cart = await Cart.findByPk(cartId);
  const items = await CartItem.findAll({ where: { cart_id: cartId } });
  cart.total_amount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  await cart.save();
  return cart;
};

const clearCartByUserId = async (userId) => {
  const cart = await Cart.findOne({ where: { user_id: userId } });
  await CartItem.destroy({ where: { cart_id: cart.id } });
  cart.total_amount = 0;
  await cart.save();
  return cart;
};

module.exports = { getCartByUserId, addItemToCart, updateItemQuantity, removeItem, clearCartByUserId };
