const mongoose = require('mongoose')

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    following: {
      type: [{ user: { type: mongoose.Schema.ObjectId, ref: 'User' }, followAt: { type: Date, default: Date.now } }],
      default: [],
    },
    follower: {
      type: [{ user: { type: mongoose.Schema.ObjectId, ref: 'User' }, followAt: { type: Date, default: Date.now } }],
      default: [],
    },
  },
  { versionKey: false }
)

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
