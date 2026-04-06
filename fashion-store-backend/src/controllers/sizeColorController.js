const { Size, Color } = require('../models');

// Sizes
const getSizes = async (req, res) => {
  const sizes = await Size.findAll({ where: { status: 1 } });
  res.json(sizes);
};

const createSize = async (req, res) => {
  const size = await Size.create(req.body);
  res.status(201).json(size);
};

const updateSize = async (req, res) => {
  const size = await Size.findByPk(req.params.id);
  if (!size) return res.status(404).json({ message: 'Size not found' });
  await size.update(req.body);
  res.json(size);
};

const deleteSize = async (req, res) => {
  const size = await Size.findByPk(req.params.id);
  if (!size) return res.status(404).json({ message: 'Size not found' });
  await size.destroy();
  res.json({ message: 'Size deleted' });
};

// Colors
const getColors = async (req, res) => {
  const colors = await Color.findAll({ where: { status: 1 } });
  res.json(colors);
};

const createColor = async (req, res) => {
  const color = await Color.create(req.body);
  res.status(201).json(color);
};

const updateColor = async (req, res) => {
  const color = await Color.findByPk(req.params.id);
  if (!color) return res.status(404).json({ message: 'Color not found' });
  await color.update(req.body);
  res.json(color);
};

const deleteColor = async (req, res) => {
  const color = await Color.findByPk(req.params.id);
  if (!color) return res.status(404).json({ message: 'Color not found' });
  await color.destroy();
  res.json({ message: 'Color deleted' });
};

module.exports = {
  getSizes, createSize, updateSize, deleteSize,
  getColors, createColor, updateColor, deleteColor
};
