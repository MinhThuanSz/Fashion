const jwt = require('jsonwebtoken');
const { User, Role } = require('../database');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        include: Role,
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found', data: null });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed', data: null });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token', data: null });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.Role && req.user.Role.name === 'Admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin', data: null });
  }
};

module.exports = { protect, admin };
