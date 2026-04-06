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
  product_variant_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Mã sản phẩm phải là số nguyên',
    'number.positive': 'Mã sản phẩm phải lớn hơn 0',
    'any.required': 'Mã sản phẩm là bắt buộc'
  }),
  quantity: Joi.number().integer().greater(0).required().messages({
    'number.greater': 'Số lượng phải lớn hơn 0',
    'any.required': 'Số lượng là bắt buộc'
  })
});

const orderSchema = Joi.object({
  receiver_name: Joi.string().trim().required().messages({
    'string.empty': 'Tên người nhận không được để trống',
    'any.required': 'Tên người nhận là bắt buộc'
  }),
  phone: Joi.string().trim().required().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'any.required': 'Số điện thoại là bắt buộc'
  }),
  shipping_address: Joi.string().trim().required().messages({
    'string.empty': 'Địa chỉ giao hàng không được để trống',
    'any.required': 'Địa chỉ giao hàng là bắt buộc'
  }),
  email: Joi.string().trim().email().allow('', null).optional(),
  city: Joi.string().trim().allow('', null).optional(),
  note: Joi.string().trim().allow('', null).optional(),
  payment_method: Joi.string().trim().default('COD').valid('COD', 'TRANSFER', 'CASH').optional(),
  items: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.object({
        product_variant_id: Joi.number().positive().optional(),
        product_id: Joi.number().positive().optional(),
        quantity: Joi.number().positive().required().messages({
          'number.positive': 'Số lượng phải lớn hơn 0',
          'any.required': 'Số lượng là bắt buộc'
        }),
        unit_price: Joi.number().min(0).optional(),
        subtotal: Joi.number().min(0).optional()
      })
        .required()
        .min(1) // At least 1 property
    )
    .messages({
      'array.min': 'Đơn hàng phải có ít nhất 1 sản phẩm',
      'any.required': 'Danh sách sản phẩm là bắt buộc'
    })
});

module.exports = {
  productSchema,
  variantSchema,
  cartItemSchema,
  orderSchema
};
