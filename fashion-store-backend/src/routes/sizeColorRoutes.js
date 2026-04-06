const express = require('express');
const router = express.Router();
const { getSizes, createSize, updateSize, deleteSize, getColors, createColor, updateColor, deleteColor } = require('../controllers/sizeColorController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Sizes
router.get('/sizes', getSizes);
router.post('/sizes', protect, admin, createSize);
router.put('/sizes/:id', protect, admin, updateSize);
router.delete('/sizes/:id', protect, admin, deleteSize);

// Colors
router.get('/colors', getColors);
router.post('/colors', protect, admin, createColor);
router.put('/colors/:id', protect, admin, updateColor);
router.delete('/colors/:id', protect, admin, deleteColor);

module.exports = router;
