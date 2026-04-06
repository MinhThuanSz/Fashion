const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
    defaultValue: 'Pending' // Pending, Confirmed, Shipping, Success, Cancelled
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'COD'
  },
  payment_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Unpaid' // Unpaid, Paid, Refunded
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;
