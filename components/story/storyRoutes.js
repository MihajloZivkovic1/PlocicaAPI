// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('./storyController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');

router.post('/create/:id', catchAsyncError(storyController.createStory));
router.get('/:id', catchAsyncError(storyController.getAllProfileStories));
router.delete('/:storyId', catchAsyncError(storyController.deleteProfileStory))
router.put('/:storyId', catchAsyncError(storyController.updateStory))


module.exports = router;