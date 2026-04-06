const express = require('express');
const router = express.Router();
const { getSummary, getRevenueByDay, getRevenueByMonth } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/summary', protect, admin, getSummary);
router.get('/revenue-by-day', protect, admin, getRevenueByDay);
router.get('/revenue-by-month', protect, admin, getRevenueByMonth);

module.exports = router;
