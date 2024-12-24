const express = require('express');
const router = express.Router();
const groupController = require('./groupController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');


router.post('/createAll/:profileId', catchAsyncError(groupController.createGroupAndLinks));
router.post('/:profileId', catchAsyncError(groupController.createGroup));
router.delete('/:groupId', catchAsyncError(groupController.deleteGroup));
router.get('/:profileId', catchAsyncError(groupController.getProfilesGroups));


module.exports = router;