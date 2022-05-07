const successHandle = require('../server/handle')
const LikesPostModel = require('../models/LikesPostModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const likesPostControllers = {
  getUserLikesPost: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得使用者喜歡的貼文列表')
  }),
}

module.exports = likesPostControllers
