const express = require('express');
const router = express.Router();
const { Order, User, Product, sequelize } = require('../database');
const { Op } = require('sequelize');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get dashboard summary
router.get('/summary', protect, admin, async (req, res) => {
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
      order: [['createdAt', 'DESC']],
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
});

router.get('/revenue-by-day', protect, admin, async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn('CAST', sequelize.col('createdAt'), 'DATE'), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        [Op.or]: [{ order_status: 'SUCCESS' }, { payment_status: 'PAID' }]
      },
      group: [sequelize.fn('CAST', sequelize.col('createdAt'), 'DATE')],
      order: [[sequelize.fn('CAST', sequelize.col('createdAt'), 'DATE'), 'ASC']],
      limit: 30
    });
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue-by-month', protect, admin, async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        [Op.or]: [{ order_status: 'SUCCESS' }, { payment_status: 'PAID' }]
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
      limit: 12
    });
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
