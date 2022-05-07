const successHandle = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const postsControllers = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const { sort, search } = req.query
    const q = search !== undefined ? { content: new RegExp(search) } : {}

    if (sort && sort !== 'news') {
      const post = await Post.aggregate([
        {
          $match: q,
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
        populate: { path: 'commenter' },
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
          populate: { path: 'commenter' },
        })
        .sort({ createdAt: -1 })
      successHandle(res, post)
    }
  }),

  deletePosts: handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({})
    successHandle(res, [], '刪除全部成功')
  }),
}

module.exports = postsControllers
