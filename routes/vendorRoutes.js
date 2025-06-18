const express = require('express');
const router = express.Router();
const authController = require('../controllers/vendor/authController');
const dashboardController = require('../controllers/vendor/dashboardController');
const commonController = require('../controllers/vendor/commonController');
const { ensureVendorAuthenticated, verifyToken } = require('../middlewares/authMiddleware');
const { loginValidationRules } = require('../middlewares/validators');

//Auth Routes
router.get('/login', authController.login);
router.post('/login', loginValidationRules, authController.postLogin);
router.get('/logout', authController.logout);

//Dashboard Routes
router.get('/dashboard', ensureVendorAuthenticated, dashboardController.index);


//Common Operation Routes
router.get('/deleteRecord', ensureVendorAuthenticated, commonController.deleteRecord);
router.get('/changeStatus', ensureVendorAuthenticated, commonController.changeStatus);

module.exports = router;