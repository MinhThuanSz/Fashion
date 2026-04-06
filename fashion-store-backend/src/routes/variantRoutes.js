const express = require('express');
const router = express.Router();
const { ProductVariant, Size, Color } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { product_id, size_id, color_id } = req.query;
    const where = {};
    if (product_id) where.product_id = product_id;
    if (size_id) where.size_id = size_id;
    if (color_id) where.color_id = color_id;

    const variants = await ProductVariant.findAll({
      where,
      include: [
        { model: Size, as: 'size', attributes: ['name'] },
        { model: Color, as: 'color', attributes: ['name', 'hex_code'] }
      ]
    });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const variant = await ProductVariant.create(req.body);
    res.status(201).json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    await variant.update(req.body);
    res.json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    await variant.destroy();
    res.json({ message: 'Variant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
