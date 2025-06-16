const express = require('express');
const router = express.Router();
const authController = require('../controllers/api/authController'); // Capital 'A'
const { ensureAuthenticated, verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = require('../utils/multer');

// API Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/imageUpload', upload.single('image'), authController.imageUpload);
router.get('/logout', verifyToken, authController.logout);

module.exports = router;