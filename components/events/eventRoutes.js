// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('./eventController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');


router.post('/create/:profileId', catchAsyncError(eventController.createEvent));
router.get('/:profileId', catchAsyncError(eventController.getProfileEvents));
router.delete('/:eventId', catchAsyncError(eventController.deleteEvent));
router.put('/:eventId', catchAsyncError(eventController.editEvent));

module.exports = router;