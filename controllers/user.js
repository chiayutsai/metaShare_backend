const bcrypt = require('bcryptjs')
const validator = require('validator')
const successHandle = require('../server/handle')
const User = require('../models/UsersModel')
const Verification = require('../models/VerificationModel')
const Profile = require('../models/ProfileModel')
const LikesPost = require('../models/LikesPostModel')
const Follow = require('../models/FollowModel')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')
const { generateSendJWT } = require('../service/auth')
const sendEmail = require('../service/email')

const userControllers = {
  getAllUsers: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得全部使用者')
  }),
  register: handleErrorAsync(async (req, res, next) => {
    let { name, email, password } = req.body

    // 內容不可為空
    if (!email || !password || !name) {
      return next(appError(400, '欄位未正確填寫！'))
    }

    // 密碼至少要 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數低於 8 碼'))
    }

    // 密碼需英數混合
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英數混合'))
    }

    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, 'Email 格式不正確'))
    }

    const hasEmail = await User.findOne({ email })
    if (hasEmail) {
      return next(appError(400, '此 E-mail 已被註冊'))
    }

    //加密密碼
    bcryptPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      name,
      email,
      password: bcryptPassword,
    })
    const user = newUser.id
    await Profile.create({ user })
    await LikesPost.create({ user })
    await Follow.create({ user })
    generateSendJWT(newUser, res, false)
  }),

  logIn: handleErrorAsync(async (req, res, next) => {
    let { email, password } = req.body
    if (!email || !password) {
      return next(appError(400, '欄位未正確填寫！'))
    }

    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, 'Email 格式不正確'))
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(appError(400, '輸入的帳號或密碼不正確'))
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return next(appError(400, '輸入的帳號或密碼不正確'))
    }
    generateSendJWT(user, res, false)
  }),

  check: handleErrorAsync(async (req, res, next) => {
    generateSendJWT(req.user, res, false)
  }),

  checkEmail: handleErrorAsync(async (req, res, next) => {
    const { email } = req.body

    // 內容不可為空
    if (!email) {
      return next(appError(400, '欄位未正確填寫！'))
    }

    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, 'Email 格式不正確'))
    }

    const user = await User.findOne({ email }).select('+email')
    if (!user) {
      return next(appError(400, '此 E-mail 尚未註冊'))
    }

    await Verification.findOneAndDelete({ userId: user._id })

    const { verification } = await Verification.create({
      userId: user._id,
      verification: (Math.floor(Math.random() * 9000) + 1000).toString(),
    })
    sendEmail(user, verification, res, next)
  }),

  verification: handleErrorAsync(async (req, res, next) => {
    const inputEmail = req.body.email
    const inputVerification = req.body.verification
    if (!inputVerification) {
      return next(appError(400, '請輸入收到的驗證碼！'))
    }
    const user = await User.findOne({ email: inputEmail })
    const { verification } = await Verification.findOne({ userId: user._id })

    if (inputVerification !== verification) {
      return next(appError(400, '驗證碼輸入錯誤，請重新輸入'))
    }
    generateSendJWT(user, res, true)
  }),

  resetPassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword) {
      return next(appError(400, '欄位未正確填寫！'))
    }
    // 密碼至少要 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數低於 8 碼'))
    }

    // 密碼需英數混合
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英數混合'))
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼輸入不一致！'))
    }

    const newPassword = await bcrypt.hash(password, 12)

    await User.findByIdAndUpdate(req.user._id, {
      password: newPassword,
    })
    successHandle(res, [], '密碼更新成功')
  }),

  getProfile: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params
    const profile = await Profile.findOne({ user: id }).populate({
      path: 'user',
    })
    let userProfile = {}
    if (!profile) {
      return next(appError(400, '查無此用戶'))
    }
    successHandle(res, profile, '取得使用者資訊')
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { _id } = req.user
    const { name, avator, coverImage, coverImageBlur, description, tags } = req.body
    if ((!name && !avator, !coverImage && !coverImageBlur && !description && !tags)) {
      return next(appError(400, '請輸入要更新的資訊'))
    }
    await User.findByIdAndUpdate(_id, { name, avator }, { returnDocument: 'after' })
    const profile = await Profile.findOneAndUpdate({ userId: _id }, { coverImage, coverImageBlur, description, tags }, { returnDocument: 'after' }).populate({
      path: 'user',
    })
    successHandle(res, profile, '更新成功')
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword) {
      return next(appError(400, '欄位未正確填寫！'))
    }
    // 密碼至少要 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數低於 8 碼'))
    }

    // 密碼需英數混合
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英數混合'))
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼輸入不一致！'))
    }
    const newPassword = await bcrypt.hash(password, 12)

    const user = await User.findByIdAndUpdate(req.user._id, {
      password: newPassword,
    })
    generateSendJWT(user, res, false)
  }),
}

module.exports = userControllers
