/**
 * Utility: Làm sạch cart items lỗi (variant không tồn tại hay bị ẩn)
 * 
 * Chạy script:
 *   node src/utils/cartCleaner.js
 * 
 * Hoặc có thể call function từ service
 */

const { Cart, CartItem, ProductVariant } = require('../models');

/**
 * Làm sạch cart của user:
 * - Loại bỏ items có variant không tồn tại
 * - Loại bỏ items có variant bị ẩn (status != 1)
 * - Cập nhật total_amount
 */
const cleanCartByUserId = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{ model: CartItem, as: 'items' }]
    });

    if (!cart) {
      console.log(`✗ Cart không tồn tại cho user ${userId}`);
      return { success: false, message: 'Cart not found' };
    }

    const items = cart.items || [];
    if (items.length === 0) {
      console.log(`✓ Cart rỗng, không cần làm sạch`);
      return { success: true, cleaned: 0, message: 'Cart is empty' };
    }

    // Lọc các item lỗi
    let cleanedCount = 0;
    const itemIdsToDelete = [];

    for (const cartItem of items) {
      const variant = await ProductVariant.findByPk(cartItem.product_variant_id);

      if (!variant) {
        console.log(`  ✗ Xóa: CartItem ${cartItem.id} - Variant ${cartItem.product_variant_id} không tồn tại`);
        itemIdsToDelete.push(cartItem.id);
        cleanedCount++;
      } else if (variant.status !== 1) {
        console.log(`  ✗ Xóa: CartItem ${cartItem.id} - Variant ${cartItem.product_variant_id} bị ẩn (status=${variant.status})`);
        itemIdsToDelete.push(cartItem.id);
        cleanedCount++;
      }
    }

    // Xóa items lỗi
    if (itemIdsToDelete.length > 0) {
      await CartItem.destroy({
        where: { id: itemIdsToDelete }
      });
      console.log(`✓ Đã xóa ${cleanedCount} item lỗi`);
    }

    // Cập nhật total_amount
    const remainingItems = await CartItem.findAll({
      where: { cart_id: cart.id }
    });

    cart.total_amount = remainingItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    await cart.save();

    console.log(`✓ Cập nhật total_amount = ${cart.total_amount}`);
    return {
      success: true,
      cleaned: cleanedCount,
      remaining: remainingItems.length,
      total_amount: cart.total_amount,
      message: `Làm sạch xong: xóa ${cleanedCount} item lỗi, còn ${remainingItems.length} item`
    };
  } catch (error) {
    console.error(`✗ Lỗi khi làm sạch cart: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Làm sạch toàn bộ cart lỗi trong hệ thống
 */
const cleanAllCarts = async () => {
  try {
    const carts = await Cart.findAll({
      include: [{ model: CartItem, as: 'items' }]
    });

    console.log(`\n🔍 Bắt đầu làm sạch ${carts.length} giỏ hàng...\n`);

    let totalCleaned = 0;

    for (const cart of carts) {
      console.log(`\n📦 Cart ID: ${cart.id} (User: ${cart.user_id})`);
      const result = await cleanCartByUserId(cart.user_id);
      if (result.success) {
        totalCleaned += result.cleaned;
      }
    }

    console.log(`\n✓ Hoàn tất! Tổng cộng xóa ${totalCleaned} item lỗi\n`);
    return { success: true, totalCleaned };
  } catch (error) {
    console.error(`✗ Lỗi: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  cleanCartByUserId,
  cleanAllCarts
};

// Chạy script trực tiếp
if (require.main === module) {
  (async () => {
    await cleanAllCarts();
    process.exit(0);
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
