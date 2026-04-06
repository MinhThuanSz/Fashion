const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorsArr = error.details.map((d) => d.message);
    return res.status(400).json({ 
      success: false,
      message: 'Validation Error',
      errors: errorsArr
    });
  }
  next();
};

module.exports = validate;
