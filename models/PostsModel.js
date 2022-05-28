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
    },
    likes: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
})
const Post = mongoose.model('Post', postSchema)

module.exports = Post
