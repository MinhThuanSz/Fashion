const { Product, Category, Brand, ProductImage, ProductVariant, Size, Color } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (query) => {
  const { category, brand, gender, keyword, min_price, max_price, page = 1, limit = 10 } = query;
  const where = { status: 1 };
  if (category) where.category_id = category;
  if (brand) where.brand_id = brand;
  if (gender) where.gender = gender;
  if (keyword) where.name = { [Op.like]: `%${keyword}%` };
  if (min_price || max_price) {
    where.price = {};
    if (min_price) where.price[Op.gte] = min_price;
    if (max_price) where.price[Op.lte] = max_price;
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Brand, attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', where: { is_main: true }, required: false }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });
  return { total: count, page: parseInt(page), pages: Math.ceil(count / limit), products: rows };
};

const getProductById = async (id) => {
  const isNumeric = !isNaN(id);
  const product = await Product.findOne({
    where: isNumeric ? { id } : { slug: id },
    include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Brand, attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images' },
        { model: ProductVariant, as: 'variants', include: [{ model: Size, as: 'size' }, { model: Color, as: 'color' }] }
    ]
  });
  if (!product) throw new Error('Product not found');
  return product;
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  return await product.update(data);
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  return await product.destroy();
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
