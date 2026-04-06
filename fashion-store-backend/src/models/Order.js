const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Sử dụng userId làm thuộc tính chuẩn (Sequelize sẽ tự ánh xạ sang user_id nhờ underscored: true)
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  receiver_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT
  },
  total_amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  order_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'PENDING'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'COD'
  },
  payment_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'UNPAID'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;
