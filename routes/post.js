const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postControllers = require('../controllers/post')
const User = require('../models/UsersModel')
const appError = require('../service/appError')

const isValidId = (req, res, next) => {
  const { id } = req.params
  const isValidId = mongoose.Types.ObjectId.isValid(authorId)
  if (!isValidId) {
    return next(appError(400, '貼文 ID 格式錯誤，請重新確認'))
  }
  next()
}
const checkPostAuthor = async (req, res, next) => {
  const authorId = req.body.author
  const isValidId = mongoose.Types.ObjectId.isValid(authorId)
  if (!isValidId) {
    return next(appError(400, '貼文 ID 格式錯誤，請重新確認'))
  }
  const hasAuthor = await User.findById(authorId).exec()
  if (!hasAuthor) {
    return next(appError(400, '無此用戶，請重新登入'))
  }
  next()
}

router.post('/', checkPostAuthor, postControllers.addPost)

router.delete('/:id', isValidId, postControllers.deletePost)

router.patch('/:id', isValidId, postControllers.updatePost)

module.exports = router
