const express = require('express');
const router = express.Router();
const linkController = require('./linkController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');



router.post('/:groupId', catchAsyncError(linkController.createLink));
router.delete('/:linkId', catchAsyncError(linkController.deleteLink));
router.get('/:groupId', catchAsyncError(linkController.getLinks));
router.put('/:linkId', catchAsyncError(linkController.updateLink))

module.exports = router;