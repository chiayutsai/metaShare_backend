const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postControllers = require('../controllers/post')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const appError = require('../service/appError')

const checkPostId = async (req, res, next) => {
  const { id } = req.params
  const isValidId = mongoose.Types.ObjectId.isValid(id)
  if (!isValidId) {
    return next(appError(400, '貼文 ID 格式錯誤，請重新確認'))
  }
  const post = await Post.findById(id)
  if (!post) {
    return next(appError(400, '查無此篇貼文，貼文已不存在'))
  }
  next()
}

const checkPostAuthor = async (req, res, next) => {
  const authorId = req.body.author
  const isValidId = mongoose.Types.ObjectId.isValid(authorId)
  if (!isValidId) {
    return next(appError(400, '請輸入正確的使用者 ID'))
  }
  const hasAuthor = await User.findById(authorId).exec()
  if (!hasAuthor) {
    return next(appError(400, '無此用戶，請重新登入'))
  }
  next()
}

router.get('/:id', checkPostId, postControllers.getPost)

router.get('/:id/likes', checkPostId, postControllers.getPostLikes)

router.get('/:id/comments', checkPostId, postControllers.getPostComments)

router.post('/', checkPostAuthor, postControllers.addPost)

router.delete('/:id', checkPostId, postControllers.deletePost)

router.patch('/:id', checkPostId, postControllers.updatePost)

router.patch('/:id/likes', checkPostId, checkPostAuthor, postControllers.updatePostLikes)

router.patch('/:id/comments', checkPostId, checkPostAuthor, postControllers.updatePostComments)
module.exports = router
