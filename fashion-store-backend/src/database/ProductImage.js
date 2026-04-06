const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_main: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_images',
  timestamps: true,
  underscored: true
});

module.exports = ProductImage;
