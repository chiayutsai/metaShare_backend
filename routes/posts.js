const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postsControllers = require('../controllers/posts')
const User = require('../models/UsersModel')
const appError = require('../service/appError')

router.get('/', postsControllers.getPosts)

module.exports = router
