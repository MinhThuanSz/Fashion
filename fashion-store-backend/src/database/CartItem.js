const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(18, 2)
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  underscored: true
});

module.exports = CartItem;
