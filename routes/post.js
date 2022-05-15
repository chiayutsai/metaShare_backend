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

router.get('/posts', isAuth, postControllers.getPosts)
router.get('/posts/user/:userId', isAuth, postControllers.getPosts)

router.get('/post/:id', isAuth, checkPostId, postControllers.getPost)

router.get('/post/:id/likes', isAuth, checkPostId, postControllers.getPostLikes)

router.get('/post/:id/comments', isAuth, checkPostId, postControllers.getPostComments)

router.post('/post/', isAuth, postControllers.addPost)

router.delete('/post/:id', isAuth, checkPostId, postControllers.deletePost)

router.patch('/post/:id', isAuth, checkPostId, postControllers.updatePost)

router.patch('/post/:id/likes', isAuth, checkPostId, postControllers.updatePostLikes)

router.patch('/post/:id/comments', isAuth, checkPostId, postControllers.updatePostComments)
module.exports = router
