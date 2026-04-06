const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

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
  image_url: Joi.string().allow('', null)
});

const variantSchema = Joi.object({
  product_id: Joi.number().required(),
  size_id: Joi.number().required(),
  color_id: Joi.number().required(),
  sku: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  extra_price: Joi.number().min(0).default(0),
  status: Joi.number().valid(0, 1)
});

const orderSchema = Joi.object({
  receiver_name: Joi.string().required(),
  phone: Joi.string().required(),
  shipping_address: Joi.string().required(),
  note: Joi.string().allow('', null),
  payment_method: Joi.string().required(),
  total_amount: Joi.number().min(0).optional(),
  items: Joi.array().items(
    Joi.object({
      product_variant_id: Joi.number().optional(),
      product_id: Joi.number().optional(),
      quantity: Joi.number().min(1).required(),
      unit_price: Joi.number().min(0).optional(),
      subtotal: Joi.number().min(0).optional()
    })
  ).optional()
});

const productRules = validate(productSchema);
const productUpdateRules = validate(productSchema.fork(Object.keys(productSchema.describe().keys), (s) => s.optional()));
const variantRules = validate(variantSchema);
const orderRules = validate(orderSchema);

module.exports = {
  productRules,
  productUpdateRules,
  variantRules,
  orderRules,
  productSchema,
  variantSchema,
  orderSchema
};
