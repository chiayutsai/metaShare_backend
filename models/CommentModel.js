const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '留言內容為必填'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: ['true', '使用者 ID 為必填'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      require: ['true', 'Post ID 為必填'],
    },
  },
  { versionKey: false }
)
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'commenter',
  })

  next()
})

commentSchema.pre('save', function (next) {
  this.populate({
    path: 'commenter',
  })

  next()
})
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
