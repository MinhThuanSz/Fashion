const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Size = sequelize.define('Size', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20) // Clothing, Shoes
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'sizes',
  timestamps: true,
  underscored: true
});

module.exports = Size;
