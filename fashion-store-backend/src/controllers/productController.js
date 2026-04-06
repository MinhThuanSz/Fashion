const productService = require('../services/productService');
const { ProductImage } = require('../models');

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, message: 'Products fetched', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, message: 'Product detail fetched', data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { image_url, ...productData } = req.body;
    const product = await productService.createProduct(productData);

    // If image_url was provided, save it to product_images
    if (image_url && image_url.trim()) {
      await ProductImage.create({
        product_id: product.id,
        image_url: image_url.trim(),
        is_main: true
      });
    }

    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { image_url, ...productData } = req.body;
    const product = await productService.updateProduct(req.params.id, productData);

    // If image_url was provided, upsert main image
    if (image_url !== undefined) {
      const existing = await ProductImage.findOne({ where: { product_id: req.params.id, is_main: true } });
      if (existing) {
        if (image_url.trim()) {
          await existing.update({ image_url: image_url.trim() });
        } else {
          await existing.destroy(); // Remove image if URL cleared
        }
      } else if (image_url.trim()) {
        await ProductImage.create({ product_id: req.params.id, image_url: image_url.trim(), is_main: true });
      }
    }

    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
