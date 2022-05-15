const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    coverImage: {
      type: String,
    },
    coverImageBlur: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { versionKey: false }
)

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
