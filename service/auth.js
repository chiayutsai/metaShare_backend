const express = require('express')
const jwt = require('jsonwebtoken')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandle = require('../server/handle')
const appError = require('../service/appError')
const User = require('../models/UsersModel')

const generateSendJWT = (user, res, isResetPassword) => {
  const erpire = isResetPassword?process.env.JWT_EXPIRES_RESET_PASSWORD_DAY:process.env.JWT_EXPIRES_DAY
  // 產生 JWT token
  const token = jwt.sign({ id: user._id, isResetPassword }, process.env.JWT_SECRET, {
    expiresIn: erpire,
  })

  let newUser = {
    id: user._id,
    name: user.name,
    avator: user.avator,
    token,
  }

  if (isResetPassword) {
    newUser = {
      token,
    }
  }
  successHandle(res, newUser)
}

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

module.exports = { generateSendJWT, verificationAuth, isAuth }
