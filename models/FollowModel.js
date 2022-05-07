const mongoose = require('mongoose')

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    following: {
      type: [{ userId: { type: mongoose.Schema.ObjectId, ref: 'User' }, followAt: Date }],
      default: [],
    },
    follower: {
      type: [{ userId: { type: mongoose.Schema.ObjectId, ref: 'User' }, followAt: Date }],
      default: [],
    },
  },
  { versionKey: false }
)

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
