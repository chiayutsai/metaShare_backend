const successHandle = require('../server/handle')
const LikesPost = require('../models/LikesPostModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const likesPostControllers = {
  getUserLikesPost: handleErrorAsync(async (req, res, next) => {
    const { _id } = req.user
    const { posts } = await LikesPost.findOne({ userId: _id }).populate({
      path: 'posts',
      select: '_id author content imageUrls createdAt',
      populate: { path: 'author', select: 'name avator' },
    })
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    successHandle(res, posts)
  }),
}

module.exports = likesPostControllers
