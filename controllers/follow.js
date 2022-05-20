const successHandle = require('../server/handle')
const Follow = require('../models/FollowModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const followControllers = {
  getFollow: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const follow = await Follow.findOne({ userId: id })
    successHandle(res, follow)
  }),
  updateFollow: handleErrorAsync(async (req, res, next) => {
    const userId = req.user._id
    const updateFollowUserId = req.params.id
    const isFollow = await Follow.findOne({
      userId: userId,
      'following.userId': updateFollowUserId,
    })
    let method = ''
    if (isFollow) {
      method = '$pull'
    } else {
      method = '$push'
    }
    const follow = await Follow.findOneAndUpdate({ userId: userId }, { [method]: { following: { userId: updateFollowUserId } } }, { returnDocument: 'after' })
      .populate({
        path: 'following',
        populate: { path: 'userId' },
      })
      .populate({
        path: 'follower',
        populate: { path: 'userId' },
      })
    await Follow.findOneAndUpdate({ userId: updateFollowUserId }, { [method]: { follower: { userId: userId } } }, { returnDocument: 'after' })

    successHandle(res, follow)
  }),
}

module.exports = followControllers
