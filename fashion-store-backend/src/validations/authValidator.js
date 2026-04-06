const { body, validationResult } = require('express-validator');

// Error checker
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation Error', 
      errors: errors.array().map(err => err.msg) 
    });
  }
  next();
};

const registerRules = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateResult
];

const loginRules = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  validateResult
];

const updateProfileRules = [
  body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
  validateResult
];

const changePasswordRules = [
  body('old_password').notEmpty().withMessage('Old password is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validateResult
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules
};
