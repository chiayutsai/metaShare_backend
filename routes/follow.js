const express = require('express')
const router = express.Router()
const followControllers = require('../controllers/follow')
const appError = require('../service/appError')

router.get('/:id', followControllers.getFollow)

router.patch('/:id', followControllers.updateFollow)

module.exports = router
