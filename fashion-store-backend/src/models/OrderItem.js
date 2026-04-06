const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id'
  },
  productVariantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_variant_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    field: 'unit_price'
  },
  subtotal: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  underscored: true
});

module.exports = OrderItem;
