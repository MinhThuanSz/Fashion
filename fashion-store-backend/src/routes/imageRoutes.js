const express = require('express');
const router = express.Router();
const { addImage, updateImage, deleteImage, setMainImage } = require('../controllers/imageController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, addImage);
router.put('/:id', protect, admin, updateImage);
router.delete('/:id', protect, admin, deleteImage);
router.put('/:id/set-main', protect, admin, setMainImage);

module.exports = router;
