const express = require('express')
const router = express.Router()
const storiesControllers = require('../controllers/stories')
const appError = require('../service/appError')

router.get('/', storiesControllers.getAllStories)

module.exports = router
