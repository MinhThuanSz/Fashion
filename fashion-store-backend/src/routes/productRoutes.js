const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { productSchema } = require('../validations/productValidation');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, validate(productSchema), createProduct);
router.put('/:id', protect, admin, validate(productSchema), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
