// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middlewares/authMiddleware')
const { catchAsyncError } = require('../../lib/functionErrorHandler');

router.post('/activate/:qrCode', catchAsyncError(userController.activate));
router.post('/login', catchAsyncError(userController.loginUser));
router.post('/refresh-token', userController.refreshToken);
router.get('/verify', catchAsyncError(userController.verifyUser));
router.get('/users', authMiddleware.authenticateToken, catchAsyncError(userController.getAllUsers));
router.post('/addNewProfile', authMiddleware.authenticateToken, catchAsyncError(userController.addNewProfile))
router.get('/getUsersProfiles/:id', catchAsyncError(userController.getUsersProfiles))
router.post('/activateIfUserExists/:userId', catchAsyncError(userController.activateIfUserAlreadyExists))


module.exports = router;