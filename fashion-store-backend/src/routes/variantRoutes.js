const express = require('express');
const router = express.Router();
const { getVariants, createVariant, updateVariant, deleteVariant } = require('../controllers/variantController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { variantSchema } = require('../validations/productValidation');

router.get('/', getVariants);
router.post('/', protect, admin, validate(variantSchema), createVariant);
router.put('/:id', protect, admin, validate(variantSchema), updateVariant);
router.delete('/:id', protect, admin, deleteVariant);

module.exports = router;
