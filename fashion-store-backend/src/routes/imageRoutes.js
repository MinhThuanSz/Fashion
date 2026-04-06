const express = require('express');
const router = express.Router();
const { ProductImage } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, async (req, res) => {
  try {
    const { product_id, image_url, is_main, sort_order } = req.body;
    if (is_main) {
      await ProductImage.update({ is_main: false }, { where: { product_id } });
    }
    const image = await ProductImage.create({ product_id, image_url, is_main, sort_order });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (req.body.is_main) {
      await ProductImage.update({ is_main: false }, { where: { product_id: image.product_id } });
    }
    await image.update(req.body);
    res.json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await image.destroy();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/set-main', protect, admin, async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await ProductImage.update({ is_main: false }, { where: { product_id: image.product_id } });
    image.is_main = true;
    await image.save();
    res.json({ message: 'Set main image successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
