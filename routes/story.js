const express = require('express')
const router = express.Router()
const storyControllers = require('../controllers/story')
const appError = require('../service/appError')

router.post('/', storyControllers.addStory)

router.delete('/:id', storyControllers.deleteStory)

module.exports = router
