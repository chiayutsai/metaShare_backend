const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postControllers = require('../controllers/post')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const appError = require('../service/appError')
const { isAuth } = require('../service/auth')

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

router.get('/:id', isAuth, checkPostId, postControllers.getPost)

router.get('/:id/likes', isAuth, checkPostId, postControllers.getPostLikes)

router.get('/:id/comments', isAuth, checkPostId, postControllers.getPostComments)

router.post('/', isAuth, postControllers.addPost)

router.delete('/:id', isAuth, checkPostId, postControllers.deletePost)

router.patch('/:id', isAuth, checkPostId, postControllers.updatePost)

router.patch('/:id/likes', isAuth, checkPostId, postControllers.updatePostLikes)

router.patch('/:id/comments', isAuth, checkPostId, postControllers.updatePostComments)
module.exports = router
