const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postControllers = require('../controllers/post')
const User = require('../models/UsersModel')
const appError = require('../service/appError')

const checkPostAuthor = async (req, res, next) => {
  const authorId = req.body.author
  const hasAuthor = await User.findById(authorId).exec()
  if (!hasAuthor) {
    return next(appError(400, '無此用戶，請重新登入'))
  }
  next()
}

router.post('/', checkPostAuthor, postControllers.addPost)

router.delete('/:id', postControllers.deletePost)

router.patch('/:id', postControllers.updatePost)

module.exports = router
