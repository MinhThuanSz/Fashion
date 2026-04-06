const express = require('express');
const router = express.Router();
const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../controllers/categoryBrandController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', protect, admin, createBrand);
router.put('/:id', protect, admin, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

module.exports = router;
