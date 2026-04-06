const { ProductImage } = require('../models');

const addImage = async (req, res) => {
  try {
    const { product_id, image_url, is_main, sort_order } = req.body;
    
    // If setting as main, unset other main images for this product
    if (is_main) {
      await ProductImage.update({ is_main: false }, { where: { product_id } });
    }

    const image = await ProductImage.create({ product_id, image_url, is_main, sort_order });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateImage = async (req, res) => {
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
};

const deleteImage = async (req, res) => {
  try {
    const image = await ProductImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    await image.destroy();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setMainImage = async (req, res) => {
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
};

module.exports = {
  addImage,
  updateImage,
  deleteImage,
  setMainImage
};
