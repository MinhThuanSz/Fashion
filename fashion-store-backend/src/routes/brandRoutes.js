const express = require('express');
const router = express.Router();
const { Brand } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  const brands = await Brand.findAll({ order: [['name', 'ASC']] });
  res.json(brands);
});

router.get('/:id', async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.update(req.body);
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.destroy();
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
