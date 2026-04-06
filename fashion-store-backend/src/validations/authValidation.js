const Joi = require('joi');

const registerSchema = Joi.object({
  full_name: Joi.string().required().messages({
    'string.empty': 'Full name should not be empty'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email format is invalid'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  full_name: Joi.string(),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null)
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};
