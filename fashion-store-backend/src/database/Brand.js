const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1 // 1: Active, 0: Inactive
  }
}, {
  tableName: 'brands',
  timestamps: true,
  underscored: true
});

module.exports = Brand;
