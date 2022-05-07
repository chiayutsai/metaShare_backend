const express = require('express')
const router = express.Router()
const likesPostControllers = require('../controllers/likesPost')

const appError = require('../service/appError')

router.get('/:id', likesPostControllers.getUserLikesPost)

module.exports = router
