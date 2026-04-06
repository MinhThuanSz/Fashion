const express = require('express');
const router = express.Router();
const { Order, User, Product, Category, sequelize } = require('../database');
const { Op, QueryTypes } = require('sequelize');
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
    const revenue = await sequelize.query(
      `SELECT CONVERT(varchar(10), created_at, 23) AS date, SUM(total_amount) AS revenue
       FROM orders
       WHERE order_status = 'SUCCESS' OR payment_status = 'PAID'
       GROUP BY CONVERT(varchar(10), created_at, 23)
       ORDER BY CONVERT(varchar(10), created_at, 23) ASC`,
      { type: QueryTypes.SELECT }
    );

    res.json({ success: true, data: revenue.map(item => ({
      date: item.date,
      revenue: Number(item.revenue)
    })) });
  } catch (error) {
    console.error('Revenue by day error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue-by-month', protect, admin, async (req, res) => {
  try {
    const revenue = await sequelize.query(
      `SELECT FORMAT(created_at, 'yyyy-MM') AS month, SUM(total_amount) AS revenue
       FROM orders
       WHERE order_status = 'SUCCESS' OR payment_status = 'PAID'
       GROUP BY FORMAT(created_at, 'yyyy-MM')
       ORDER BY FORMAT(created_at, 'yyyy-MM') ASC`,
      { type: QueryTypes.SELECT }
    );

    res.json({ success: true, data: revenue.map(item => ({
      month: item.month,
      revenue: Number(item.revenue)
    })) });
  } catch (error) {
    console.error('Revenue by month error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue-by-year', protect, admin, async (req, res) => {
  try {
    const revenue = await sequelize.query(
      `SELECT FORMAT(created_at, 'yyyy') AS year, SUM(total_amount) AS revenue
       FROM orders
       WHERE order_status = 'SUCCESS' OR payment_status = 'PAID'
       GROUP BY FORMAT(created_at, 'yyyy')
       ORDER BY FORMAT(created_at, 'yyyy') ASC`,
      { type: QueryTypes.SELECT }
    );

    res.json({ success: true, data: revenue.map(item => ({
      year: item.year,
      revenue: Number(item.revenue)
    })) });
  } catch (error) {
    console.error('Revenue by year error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/top-products', protect, admin, async (req, res) => {
  try {
    const products = await sequelize.query(
      `SELECT TOP 10 p.id AS productId, p.name AS productName, SUM(oi.quantity) AS quantitySold, SUM(oi.subtotal) AS totalRevenue
       FROM order_items oi
       JOIN product_variants pv ON pv.id = oi.product_variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE oi.order_id IN (
         SELECT id FROM orders
         WHERE order_status = 'SUCCESS' OR payment_status = 'PAID'
       )
       GROUP BY p.id, p.name
       ORDER BY totalRevenue DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue-by-category', protect, admin, async (req, res) => {
  try {
    const categories = await sequelize.query(
      `SELECT c.id AS categoryId, c.name AS categoryName, SUM(oi.subtotal) AS revenue
       FROM order_items oi
       JOIN product_variants pv ON pv.id = oi.product_variant_id
       JOIN products p ON p.id = pv.product_id
       JOIN categories c ON c.id = p.category_id
       WHERE oi.order_id IN (
         SELECT id FROM orders
         WHERE order_status = 'SUCCESS' OR payment_status = 'PAID'
       )
       GROUP BY c.id, c.name
       ORDER BY revenue DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
