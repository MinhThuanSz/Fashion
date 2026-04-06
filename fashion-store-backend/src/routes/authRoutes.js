const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerRules, loginRules, updateProfileRules, changePasswordRules } = require('../validations/authValidator');

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);

router.get('/profile', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', protect, updateProfileRules, updateProfile);
router.put('/change-password', protect, changePasswordRules, changePassword);
router.post('/avatar', protect, uploadAvatar);

module.exports = router;
