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
  
  if (!product_variant_id || product_variant_id <= 0) {
    throw new Error('Mã sản phẩm (Variant ID) không hợp lệ.');
  }

  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) {
    throw new Error('Giỏ hàng không tồn tại. Vui lòng liên hệ quản trị viên.');
  }

  // Kiểm tra variant tồn tại và đang active (status = 1)
  const variant = await ProductVariant.findByPk(product_variant_id, {
    include: { model: Product, attributes: ['price', 'discount_price'] }
  });

  if (!variant) {
    throw new Error(
      `Sản phẩm (ID: ${product_variant_id}) không tồn tại trong hệ thống. ` +
      `Sản phẩm này có thể đã bị xóa. Vui lòng chọn sản phẩm khác.`
    );
  }

  if (variant.status !== 1) {
    throw new Error(
      `Sản phẩm (ID: ${product_variant_id}) không còn khả dụng để mua. ` +
      `Vui lòng chọn sản phẩm khác.`
    );
  }

  // Kiểm tra số lượng
  const qty = parseInt(quantity);
  if (qty <= 0) {
    throw new Error('Số lượng phải lớn hơn 0.');
  }

  // Kiểm tra stock
  if (variant.stock < qty) {
    throw new Error(
      `Sản phẩm này chỉ còn ${variant.stock} cái trong kho. ` +
      `Bạn không thể thêm ${qty} cái vào giỏ. Vui lòng giảm số lượng.`
    );
  }

  const price = variant.Product.discount_price || variant.Product.price;
  const existingItem = await CartItem.findOne({ where: { cart_id: cart.id, product_variant_id } });

  if (existingItem) {
    // Kiểm tra stock trước khi tăng quantity
    if (variant.stock < existingItem.quantity + qty) {
      throw new Error(
        `Sản phẩm này chỉ còn ${variant.stock} cái trong kho. ` +
        `Giỏ hiện có ${existingItem.quantity} cái, không thể thêm ${qty} cái nữa.`
      );
    }
    existingItem.quantity += qty;
    existingItem.subtotal = price * existingItem.quantity;
    await existingItem.save();
  } else {
    await CartItem.create({ 
      cart_id: cart.id, 
      product_variant_id, 
      quantity: qty, 
      unit_price: price, 
      subtotal: price * qty 
    });
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
