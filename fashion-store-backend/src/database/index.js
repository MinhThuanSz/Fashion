const { sequelize } = require('../config/db');
const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Brand = require('./Brand');
const Product = require('./Product');
const Size = require('./Size');
const Color = require('./Color');
const ProductVariant = require('./ProductVariant');
const ProductImage = require('./ProductImage');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Role - User
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// Category - Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Brand - Product
Brand.hasMany(Product, { foreignKey: 'brand_id' });
Product.belongsTo(Brand, { foreignKey: 'brand_id' });

// Product - ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// Product - ProductVariant
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Size - ProductVariant
Size.hasMany(ProductVariant, { foreignKey: 'size_id' });
ProductVariant.belongsTo(Size, { foreignKey: 'size_id', as: 'size' });

// Color - ProductVariant
Color.hasMany(ProductVariant, { foreignKey: 'color_id' });
ProductVariant.belongsTo(Color, { foreignKey: 'color_id', as: 'color' });

// User - Cart
User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// ProductVariant - CartItem
ProductVariant.hasMany(CartItem, { foreignKey: 'product_variant_id' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });

// User - Order (Sử dụng user_id làm foreignKey)
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Order - OrderItem (Sử dụng order_id làm foreignKey)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// ProductVariant - OrderItem (Sử dụng product_variant_id làm foreignKey)
ProductVariant.hasMany(OrderItem, { foreignKey: 'product_variant_id' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Brand,
  Product,
  Size,
  Color,
  ProductVariant,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem
};
