const successHandle = require('../server/handle')
const Follow = require('../models/FollowModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')
const appError = require('../service/appError')

const followControllers = {
  getFollow: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const follow = await Follow.findOne({ userId: id })
      .populate({
        path: 'following',
        populate: { path: 'user' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'user' },
      })
    successHandle(res, follow)
  }),
  updateFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.user._id
    const updateFollowUserId = req.params.id
    console.log(userId, updateFollowUserId)
    if (userId == updateFollowUserId) {
      return next(appError(400, '無法追蹤自己的帳號'))
    }
    const isFollow = await Follow.findOne({
      userId: userId,
      'following.user': updateFollowUserId,
    })
    let method = ''
    if (isFollow) {
      method = '$pull'
    } else {
      method = '$push'
    }
    const adminFollow = await Follow.findOneAndUpdate(
      { userId: userId },
      { [method]: { following: { user: updateFollowUserId } } },
      { returnDocument: 'after' }
    )
      .populate({
        path: 'following',
        populate: { path: 'user' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'user' },
      })
    const otherFollow = await Follow.findOneAndUpdate({ userId: updateFollowUserId }, { [method]: { follower: { user: userId } } }, { returnDocument: 'after' })
      .populate({
        path: 'following',
        populate: { path: 'user' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'user' },
      })
    const follow = {
      adminFollow,
      otherFollow,
    }
    successHandle(res, follow)
  }),
}

module.exports = followControllers
