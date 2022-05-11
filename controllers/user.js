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
    const userId = newUser.id
    await Profile.create({ userId })
    await LikesPost.create({ userId })
    await Follow.create({ userId })
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
    const user = {
      id: req.user._id,
      name: req.user.name,
      avator: req.user.avator,
    }
    successHandle(res, user)
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

    const user = await User.findOne({ email })
    if (!user) {
      return next(appError(400, '此 E-mail 尚未註冊'))
    }
    await Verification.findOneAndDelete({ userId: user._id })

    await Verification.create({
      userId: user._id,
      verification: Math.floor(Math.random() * 9000) + 1000,
    })
    //successHandle(res, '寄送驗證碼至此 E-mail')
    generateSendJWT(user, res, true)
  }),

  verification: handleErrorAsync(async (req, res, next) => {
    const inputVerification = req.body.verification
    if (!inputVerification) {
      return next(appError(400, '請輸入收到的驗證碼！'))
    }
    const { verification } = await Verification.findOne({ userId: req.user._id })
    if (inputVerification !== verification) {
      return next(appError(400, '驗證碼輸入錯誤，請重新輸入'))
    }

    successHandle(res, '驗證成功')
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
      return next(appError('400', '密碼輸入不一致！', next))
    }

    const newPassword = await bcrypt.hash(password, 12)

    await User.findByIdAndUpdate(req.user._id, {
      password: newPassword,
    })
    successHandle(res, [], '密碼更新成功')
  }),

  getProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得使用者資訊')
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '更新使用者資訊')
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '更新使用者密碼')
  }),
}

module.exports = userControllers
