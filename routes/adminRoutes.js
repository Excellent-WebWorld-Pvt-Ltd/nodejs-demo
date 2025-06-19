const express = require('express');
const router = express.Router();
const authController = require('../controllers/admin/authController');
const dashboardController = require('../controllers/admin/dashboardController');
const userController = require('../controllers/admin/userController');
const commonController = require('../controllers/commonController');
const { ensureAuthenticated, verifyToken } = require('../middlewares/authMiddleware');
const { loginValidationRules } = require('../middlewares/validators');

//Auth Routes
router.get('/login', authController.login);
router.post('/login', loginValidationRules, authController.postLogin);
router.get('/logout', authController.logout);

//Dashboard Routes
router.get('/dashboard', ensureAuthenticated, dashboardController.index);

//Users Routes
router.get('/users', ensureAuthenticated, userController.users);
router.get('/getUsers', ensureAuthenticated, userController.getUsers);
router.get('/user/edit/:id', ensureAuthenticated, userController.edit);
router.post('/user/update', ensureAuthenticated, userController.update);

//Common Operation Routes
router.get('/deleteRecord', ensureAuthenticated, commonController.deleteRecord);
router.get('/changeStatus', ensureAuthenticated, commonController.changeStatus);
router.get('/changeLanguage', commonController.changeLanguage);

module.exports = router;