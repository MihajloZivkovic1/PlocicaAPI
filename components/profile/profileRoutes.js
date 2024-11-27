// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('./profileController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');
const profile = require('../../models/profile');
const authMiddleware = require('../../middlewares/authMiddleware')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.put('/edit/:id', upload.single('profileImage'), catchAsyncError(profileController.editProfile));
router.get('/:qrCode', catchAsyncError(profileController.getProfileData));
router.put('/edit/bio/:id', catchAsyncError(profileController.editProfilesBio));
router.get('/profile/:id', catchAsyncError(profileController.getProfile));
module.exports = router;