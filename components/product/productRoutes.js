// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');

router.get('/', catchAsyncError(productController.getAllProducts));
router.get('/:qrCode', catchAsyncError(productController.getProductData));


module.exports = router;