const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userControllers = require('../controllers/user')
const User = require('../models/UsersModel')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(appError(401, '尚未登入！'))
  }

  // 驗證 token 正確性
  const decoded = await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(appError(400, '認證失敗，請重新登入'))
    } else {
      return payload
    }
  })
  if (decoded.isResetPassword) {
    return next(appError(400, '認證失敗，請重新登入'))
  }
  if (decoded) {
    const currentUser = await User.findById(decoded.id)
    req.user = currentUser
    next()
  }
})

const verificationAuth = handleErrorAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(appError(401, '請輸入E-mail 取得驗證碼'))
  }

  // 驗證 token 正確性
  const decoded = await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(appError(400, '認證失敗，請重新輸入E-mail 取得驗證碼'))
    } else {
      return payload
    }
  })
  if (!decoded.isResetPassword) {
    return next(appError(400, '認證失敗，請重新輸入E-mail 取得驗證碼'))
  }
  if (decoded) {
    const currentUser = await User.findById(decoded.id)
    req.user = currentUser
    next()
  }
})

router.get('/', userControllers.getAllUsers)

router.post('/register', userControllers.register)
router.post('/login', userControllers.logIn)
router.get('/check', isAuth, userControllers.check)

router.post('/checkEmail', userControllers.checkEmail)
router.post('/verification', verificationAuth, userControllers.verification)
router.patch('/resetPassword', verificationAuth, userControllers.resetPassword)

router.get('/profile', userControllers.getProfile)
router.patch('/profile', userControllers.updateProfile)
router.patch('/updatePassword', userControllers.updatePassword)
module.exports = router
