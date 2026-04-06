const { Order, User, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get dashboard summary
const getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    
    const totalRevenue = await Order.sum('total_amount', {
      where: {
        [Op.or]: [
          { order_status: 'SUCCESS' },
          { payment_status: 'PAID' }
        ]
      }
    }) || 0;

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'User', attributes: ['full_name'] }]
    });

    res.json({
      success: true,
      message: 'Summary fetched',
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: Number(totalRevenue),
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get revenue by day (last 7 days)
const getRevenueByDay = async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn('CAST', sequelize.col('created_at'), 'DATE'), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        [Op.or]: [
          { order_status: 'SUCCESS' },
          { payment_status: 'PAID' }
        ]
      },
      group: [sequelize.fn('CAST', sequelize.col('created_at'), 'DATE')],
      order: [[sequelize.fn('CAST', sequelize.col('created_at'), 'DATE'), 'ASC']],
      limit: 30
    });

    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get revenue by month (last 12 months)
const getRevenueByMonth = async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn('FORMAT', sequelize.col('created_at'), 'yyyy-MM'), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        [Op.or]: [
          { order_status: 'SUCCESS' },
          { payment_status: 'PAID' }
        ]
      },
      group: [sequelize.fn('FORMAT', sequelize.col('created_at'), 'yyyy-MM')],
      order: [[sequelize.fn('FORMAT', sequelize.col('created_at'), 'yyyy-MM'), 'ASC']],
      limit: 12
    });

    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummary, getRevenueByDay, getRevenueByMonth };
