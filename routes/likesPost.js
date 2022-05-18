const express = require('express')
const router = express.Router()
const likesPostControllers = require('../controllers/likesPost')
const { isAuth } = require('../service/auth')

router.get('/', isAuth, likesPostControllers.getUserLikesPost)

module.exports = router
