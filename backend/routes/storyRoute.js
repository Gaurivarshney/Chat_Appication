// server/routes/storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

// Route to upload a new story
router.post('/stories', storyController.uploadStory);

// Route to fetch all active stories
router.get('/stories', storyController.getActiveStories);

// Route to mark a story as viewed
router.post('/stories/:id/view', storyController.markStoryAsViewed);

module.exports = router;
