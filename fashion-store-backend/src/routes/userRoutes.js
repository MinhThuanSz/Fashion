const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserStatus, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/status', protect, admin, updateUserStatus);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
