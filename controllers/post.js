const successHandle = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const postControllers = {
  addPost: handleErrorAsync(async (req, res, next) => {
    const { content, imageUrls } = req.body
    if (!content && !imageUrls?.length) {
      return next(appError(400, '請輸入貼文內容或上傳一張圖片'))
    }
    const data = req.body
    const post = await Post.create({
      author: data.author,
      content: data.content,
      imageUrls: data.imageUrls,
    })
    successHandle(res, post, '新增成功')
  }),

  deletePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      return next(appError(400, '貼文 ID 格式錯誤，請重新確認'))
    }

    const post = await Post.findByIdAndDelete(id)

    if (!post) {
      return next(appError(400, '查無此篇貼文，貼文已不存在'))
    }
    successHandle(res, post, '刪除成功')
  }),

  updatePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      return next(appError(400, '貼文 ID 格式錯誤，請重新確認'))
    }

    const { content, imageUrls } = req.body
    if (!content && !imageUrls?.length) {
      return next(appError(400, '請輸入要更新的貼文內容或圖片'))
    }

    const data = req.body
    const post = await Post.findByIdAndUpdate(id, { content: data.content, imageUrls: data.imageUrls }, { returnDocument: 'after' })

    if (!post) {
      return next(appError(400, '查無此篇貼文，貼文已不存在'))
    }
    successHandle(res, post, '更新成功')
  }),
}

module.exports = postControllers
