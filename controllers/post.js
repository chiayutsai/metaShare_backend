const successHandle = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const LikesPost = require('../models/LikesPostModel')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const postControllers = {
  getPost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id)
    successHandle(res, post)
  }),

  getPostLikes: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id).populate({
      path: 'likes',
    })
    const postLikes = post.likes
    successHandle(res, postLikes)
  }),

  getPostComments: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id).populate({
      path: 'comments',
      populate: { path: 'commenter' },
    })

    const postComments = post.comments
    successHandle(res, postComments)
  }),

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
    const post = await Post.findByIdAndDelete(id)
    successHandle(res, post, '刪除成功')
  }),

  updatePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const { content, imageUrls } = req.body
    if (!content && !imageUrls?.length) {
      return next(appError(400, '請輸入要更新的貼文內容或圖片'))
    }

    const data = req.body
    const post = await Post.findByIdAndUpdate(id, { content: data.content, imageUrls: data.imageUrls }, { returnDocument: 'after' })
    successHandle(res, post, '更新成功')
  }),

  updatePostLikes: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const authorId = req.body.author
    const isLike = await Post.find({ _id: id, likes: { $in: [authorId] } })
    let method = ''
    if (isLike.length) {
      method = '$pull'
    } else {
      method = '$push'
    }
    const post = await Post.findByIdAndUpdate(id, { [method]: { likes: authorId } }, { returnDocument: 'after' })

    await LikesPost.findOneAndUpdate({ userId: authorId }, { [method]: { posts: id } }, { returnDocument: 'after' })

    successHandle(res, post, '更新成功')
  }),

  updatePostComments: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const authorId = req.body.author
    const { content } = req.body
    if (!content) {
      return next(appError(400, '請輸入留言內容'))
    }
    const data = {
      commenter: authorId,
      content,
      createdAt: Date.now(),
    }
    const post = await Post.findByIdAndUpdate(id, { $push: { comments: data } }, { returnDocument: 'after' })

    successHandle(res, post, '更新成功')
  }),
}

module.exports = postControllers
