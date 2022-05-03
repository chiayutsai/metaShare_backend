const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    content: {
      type: String,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    likes: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
      default: [],
    },
    comments: {
      type: [{ commenter: { type: mongoose.Schema.ObjectId, ref: 'User' }, content: String, createdAt: Date }],
      default: [],
    },
  },
  { versionKey: false }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
