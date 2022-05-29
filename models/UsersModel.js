const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的暱稱'],
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    isThirdPartyLogin: {
      type: Boolean,
    },
    password: {
      type: String,
      required: [true, '請輸入您的 密碼'],
      minlength: 8,
      select: false,
    },
    avator: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
)

const User = mongoose.model('User', userSchema)

module.exports = User
