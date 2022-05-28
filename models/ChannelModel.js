const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema(
  {
    user: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
      required: true,
    },
    messages: {
      type: [{ from: { type: mongoose.Schema.ObjectId, ref: 'User' }, message: String, createAt: { type: Date, default: Date.now } }],
      default: [],
    },
  },
  { versionKey: false }
)

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
