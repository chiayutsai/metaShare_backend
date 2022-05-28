const successHandle = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const LikesPost = require('../models/LikesPostModel')
const Comment = require('../models/CommentModel')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const postControllers = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const { sort, search } = req.query
    let q = {}
    if (id) {
      q = { author: mongoose.Types.ObjectId(id) }
    }
    if (search) {
      q = { ...q, content: new RegExp(search) }
    }

    if (sort && sort !== 'news') {
      const post = await Post.aggregate([
        {
          $match: q,
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post',
            as: 'comments',
          },
        },
        {
          $project: {
            author: 1,
            content: 1,
            comments: 1,
            imageUrls: 1,
            likes: 1,
            createdAt: 1,
            length: {
              $cond: { if: { $isArray: `$${sort}` }, then: { $size: `$${sort}` }, else: 'NA' },
            },
          },
        },
        {
          $sort: {
            length: -1,
          },
        },
      ])
      await Post.populate(post, {
        path: 'author',
        select: 'name avator',
      })
      await Post.populate(post, {
        path: 'comments',
      })

      successHandle(res, post)
    } else {
      const post = await Post.find(q)
        .populate({
          path: 'author',
          select: 'name avator',
        })
        .populate({
          path: 'comments',
        })
        .sort({ createdAt: -1 })
      successHandle(res, post)
    }
  }),

  getPost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id)
      .populate({
        path: 'author',
        select: 'name avator',
      })
      .populate({
        path: 'comments',
      })
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
      author: req.user.id,
      content: data.content,
      imageUrls: data.imageUrls,
    })
    successHandle(res, post, '新增成功')
  }),
  deletePosts: handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({})
    successHandle(res, [], '刪除全部成功')
  }),
  deletePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params

    const findPost = await Post.findById(id)
    const postAuthorId = findPost.author.toString()
    if (req.user.id !== postAuthorId) {
      return next(appError(400, '此使用者沒有刪除這則貼文的權限'))
    }

    const post = await Post.findByIdAndDelete(id)
    await LikesPost.updateMany(
      {
        posts: { $in: [id] },
      },
      { $pull: { posts: id } }
    )

    successHandle(res, post, '刪除成功')
  }),

  updatePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const { content, imageUrls } = req.body
    const findPost = await Post.findById(id)
    const postAuthorId = findPost.author.toString()
    if (req.user.id !== postAuthorId) {
      return next(appError(400, '此使用者沒有更新這則貼文的權限'))
    }
    if (!content && !imageUrls?.length) {
      return next(appError(400, '請輸入要更新的貼文內容或圖片'))
    }

    const data = req.body
    const post = await Post.findByIdAndUpdate(id, { content: data.content, imageUrls: data.imageUrls }, { returnDocument: 'after' })
    successHandle(res, post, '更新成功')
  }),

  updatePostLikes: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const isLike = await Post.find({ _id: id, likes: { $in: [userId] } })
    let method = ''
    if (isLike.length) {
      method = '$pull'
    } else {
      method = '$push'
    }
    const post = await Post.findByIdAndUpdate(id, { [method]: { likes: userId } }, { returnDocument: 'after' })

    await LikesPost.findOneAndUpdate({ userId: userId }, { [method]: { posts: id } }, { returnDocument: 'after' })

    successHandle(res, post, '更新成功')
  }),

  updatePostComments: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id
    const { content } = req.body
    if (!content) {
      return next(appError(400, '請輸入留言內容'))
    }

    const comment = await Comment.create({
      commenter: userId,
      content,
      post: id,
    })

    successHandle(res, comment, '留言成功')
  }),
}

module.exports = postControllers
