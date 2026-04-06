const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryBrandController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);

module.exports = router;
