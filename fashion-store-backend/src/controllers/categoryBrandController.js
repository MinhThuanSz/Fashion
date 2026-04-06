const { Category, Brand } = require('../models');

// Categories
const getCategories = async (req, res) => {
  const categories = await Category.findAll({ where: { status: 1 } });
  res.json(categories);
};

const getCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Brands
const getBrands = async (req, res) => {
  const brands = await Brand.findAll({ where: { status: 1 } });
  res.json(brands);
};

const getBrandById = async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.update(req.body);
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.destroy();
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory: async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateCategory,
  deleteCategory,
  getBrands,
  getBrandById,
  createBrand: async (req, res) => {
    try {
      const brand = await Brand.create(req.body);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateBrand,
  deleteBrand
};
