const express = require('express');
const router = express.Router();
const { Category } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.json(categories);
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
