const express = require('express');
const router = express.Router();
const { Role } = require('../models');
const { protect, admin } = require('../middlewares/authMiddleware');

// GET /api/roles - Get all roles (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
