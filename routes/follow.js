const express = require('express')
const router = express.Router()
const followControllers = require('../controllers/follow')
const appError = require('../service/appError')
const { isAuth } = require('../service/auth')
const { checkUserId } = require('../service/checkId')

router.get('/:id', isAuth, checkUserId, followControllers.getFollow)

router.patch('/:id', isAuth, checkUserId, followControllers.updateFollow)

module.exports = router
