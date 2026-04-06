const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Color = sequelize.define('Color', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  hex_code: {
    type: DataTypes.STRING(7)
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'colors',
  timestamps: true,
  underscored: true
});

module.exports = Color;
