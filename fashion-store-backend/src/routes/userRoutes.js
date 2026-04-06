const express = require('express');
const router = express.Router();
const { User, Role } = require('../database');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role,
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Role,
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.status = req.body.status;
    await user.save();
    
    res.json({ success: true, message: 'User status updated', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.role_id = req.body.role_id;
    await user.save();
    
    res.json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
