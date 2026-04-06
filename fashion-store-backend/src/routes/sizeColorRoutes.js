const express = require('express');
const router = express.Router();
const { Size, Color } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

// Sizes
router.get('/sizes', async (req, res) => {
  const sizes = await Size.findAll({ where: { status: 1 } });
  res.json(sizes);
});

router.post('/sizes', protect, admin, async (req, res) => {
  const size = await Size.create(req.body);
  res.status(201).json(size);
});

router.put('/sizes/:id', protect, admin, async (req, res) => {
  const size = await Size.findByPk(req.params.id);
  if (!size) return res.status(404).json({ message: 'Size not found' });
  await size.update(req.body);
  res.json(size);
});

router.delete('/sizes/:id', protect, admin, async (req, res) => {
  const size = await Size.findByPk(req.params.id);
  if (!size) return res.status(404).json({ message: 'Size not found' });
  await size.destroy();
  res.json({ message: 'Size deleted' });
});

// Colors
router.get('/colors', async (req, res) => {
  const colors = await Color.findAll({ where: { status: 1 } });
  res.json(colors);
});

router.post('/colors', protect, admin, async (req, res) => {
  const color = await Color.create(req.body);
  res.status(201).json(color);
});

router.put('/colors/:id', protect, admin, async (req, res) => {
  const color = await Color.findByPk(req.params.id);
  if (!color) return res.status(404).json({ message: 'Color not found' });
  await color.update(req.body);
  res.json(color);
});

router.delete('/colors/:id', protect, admin, async (req, res) => {
  const color = await Color.findByPk(req.params.id);
  if (!color) return res.status(404).json({ message: 'Color not found' });
  await color.destroy();
  res.json({ message: 'Color deleted' });
});

module.exports = router;
