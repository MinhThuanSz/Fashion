const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Role, Cart } = require('../database');
const { protect } = require('../middlewares/authMiddleware');
const { registerRules, loginRules, updateProfileRules, changePasswordRules } = require('../validations/authValidator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

router.post('/register', registerRules, async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ success: false, message: 'Email already exists' });

    const userRole = await Role.findOne({ where: { name: 'User' } });
    const user = await User.create({ full_name, email, password, role_id: userRole.id });
    await Cart.create({ user_id: user.id });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: 'User',
        role_id: user.role_id,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/login', loginRules, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { email },
      include: Role
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          avatar: user.avatar,
          role: user.Role.name,
          role_id: user.role_id,
          token: generateToken(user.id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', protect, updateProfileRules, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const data = req.body;
    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.address !== undefined) user.address = data.address;
    if (data.city !== undefined) user.city = data.city;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/change-password', protect, changePasswordRules, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user || !(await user.matchPassword(old_password))) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }
    user.password = new_password;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ success: false, message: 'No avatar provided' });
    
    const user = await User.findByPk(req.user.id);
    user.avatar = avatar;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated',
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
