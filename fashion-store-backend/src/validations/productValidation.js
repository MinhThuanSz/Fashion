const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Product name should not be empty'
  }),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price must be at least 0'
  }),
  discount_price: Joi.number().min(0).allow(null),
  gender: Joi.string().valid('Men', 'Women', 'Unisex').allow('', null),
  material: Joi.string().allow('', null),
  category_id: Joi.number().required().messages({
    'any.required': 'Category ID is required'
  }),
  brand_id: Joi.number().required().messages({
    'any.required': 'Brand ID is required'
  }),
  status: Joi.number().valid(0, 1).default(1),
  image_url: Joi.string().uri().allow('', null)
});

const variantSchema = Joi.object({
  product_id: Joi.number().required(),
  size_id: Joi.number().required(),
  color_id: Joi.number().required(),
  sku: Joi.string().required(),
  stock: Joi.number().min(0).required().messages({
    'number.min': 'Stock must be at least 0'
  }),
  extra_price: Joi.number().min(0).default(0),
  status: Joi.number().valid(0, 1)
});

const cartItemSchema = Joi.object({
  product_variant_id: Joi.number().required(),
  quantity: Joi.number().greater(0).required().messages({
    'number.greater': 'Quantity must be greater than 0'
  })
});

const orderSchema = Joi.object({
  receiver_name: Joi.string().required(),
  phone: Joi.string().required(),
  shipping_address: Joi.string().required(),
  note: Joi.string().allow('', null),
  payment_method: Joi.string().required(),
  total_amount: Joi.number().min(0).optional(), // Cho phép tổng tiền gửi từ frontend
  items: Joi.array().items(
    Joi.object({
      product_variant_id: Joi.number().allow(null, '').optional(),
      product_id: Joi.number().optional(),
      quantity: Joi.number().min(1).required(),
      unit_price: Joi.number().min(0).optional(), // Sửa thành optional để linh hoạt
      subtotal: Joi.number().min(0).optional()    // Sửa thành optional để linh hoạt
    })
  ).optional() // Chuyển sang optional nếu dùng giỏ hàng DB
});

module.exports = {
  productSchema,
  variantSchema,
  cartItemSchema,
  orderSchema
};
