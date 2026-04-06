const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size_id: {
    type: DataTypes.INTEGER
  },
  color_id: {
    type: DataTypes.INTEGER
  },
  sku: {
    type: DataTypes.STRING(100),
    unique: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  extra_price: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'product_variants',
  timestamps: true,
  underscored: true
});

module.exports = ProductVariant;
