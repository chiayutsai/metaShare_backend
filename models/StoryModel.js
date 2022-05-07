const mongoose = require('mongoose')

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    imageUrl: {
      type: String,
      required: [true, '未上傳圖片'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  { versionKey: false }
)

const Story = mongoose.model('Story', storySchema)

module.exports = Story
