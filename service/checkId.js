const mongoose = require('mongoose')
const appError = require('../service/appError')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')

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

const checkUserId = async (req, res, next) => {
  const { id } = req.params
  const isValidId = mongoose.Types.ObjectId.isValid(id)
  if (!isValidId) {
    return next(appError(400, '使用者 ID 格式錯誤，請重新確認'))
  }
  const user = await User.findById(id)
  if (!user) {
    return next(appError(400, '查無此使用者'))
  }
  next()
}
module.exports = {checkPostId,checkUserId}