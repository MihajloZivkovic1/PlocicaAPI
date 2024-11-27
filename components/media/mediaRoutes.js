// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const mediaController = require('./mediaController');
const authMiddleware = require('../../middlewares/authMiddleware')

const { catchAsyncError } = require('../../lib/functionErrorHandler');


const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:profileId', upload.single('media'), catchAsyncError(mediaController.uploadMedia));
router.get('/:profileId', catchAsyncError(mediaController.getMedia));
router.delete('/:mediaId', catchAsyncError(mediaController.deleteMedia))
module.exports = router;