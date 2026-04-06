const express = require('express');
const router = express.Router();
const { Product, Category, Brand, ProductImage, ProductVariant, Size, Color } = require('../database');
const { Op } = require('sequelize');
const { protect, admin } = require('../middlewares/authMiddleware');
const { productRules, productUpdateRules } = require('../validations/productValidation');

router.get('/', async (req, res) => {
  try {
    const { category, brand, gender, keyword, min_price, max_price, page = 1, limit = 10 } = req.query;
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
    res.json({ 
      success: true, 
      message: 'Products fetched', 
      data: { total: count, page: parseInt(page), pages: Math.ceil(count / limit), products: rows } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const isNumeric = !isNaN(id);
    const product = await Product.findOne({
      where: isNumeric ? { id } : { slug: id },
      include: [
          { model: Category, attributes: ['id', 'name'] },
          { model: Brand, attributes: ['id', 'name'] },
          { model: ProductImage, as: 'images', include: [] },
          { model: ProductVariant, as: 'variants', include: [{ model: Size, as: 'size' }, { model: Color, as: 'color' }] }
      ]
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product detail fetched', data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post('/', protect, admin, productRules, async (req, res) => {
  try {
    const { image_url, ...productData } = req.body;
    
    if (productData.category_id) {
      const cat = await Category.findByPk(productData.category_id);
      if (!cat) return res.status(400).json({ success: false, message: `Danh mục ID ${productData.category_id} không tồn tại.` });
    }
    if (productData.brand_id) {
      const b = await Brand.findByPk(productData.brand_id);
      if (!b) return res.status(400).json({ success: false, message: `Thương hiệu ID ${productData.brand_id} không tồn tại.` });
    }

    const product = await Product.create(productData);

    if (image_url && image_url.trim()) {
      await ProductImage.create({
        product_id: product.id,
        image_url: image_url.trim(),
        is_main: true
      });
    }

    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công!', data: product });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ success: false, message: 'Danh mục hoặc thương hiệu không hợp lệ.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, admin, productUpdateRules, async (req, res) => {
  try {
    const { image_url, ...productData } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (productData.category_id) {
      const cat = await Category.findByPk(productData.category_id);
      if (!cat) return res.status(400).json({ success: false, message: `Danh mục ID ${productData.category_id} không tồn tại.` });
    }
    if (productData.brand_id) {
      const b = await Brand.findByPk(productData.brand_id);
      if (!b) return res.status(400).json({ success: false, message: `Thương hiệu ID ${productData.brand_id} không tồn tại.` });
    }

    await product.update(productData);

    if (image_url !== undefined) {
      const existing = await ProductImage.findOne({ where: { product_id: req.params.id, is_main: true } });
      if (existing) {
        if (image_url.trim()) {
          await existing.update({ image_url: image_url.trim() });
        } else {
          await existing.destroy();
        }
      } else if (image_url.trim()) {
        await ProductImage.create({ product_id: req.params.id, image_url: image_url.trim(), is_main: true });
      }
    }

    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
