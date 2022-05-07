const successHandle = require('../server/handle')
const User = require('../models/UsersModel')
const VerificationModel = require('../models/VerificationModel')
const ProfileModel = require('../models/ProfileModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const userControllers = {
  getAllUsers: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得全部使用者')
  }),
  logIn: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '登入')
  }),
  logOut: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '登出')
  }),
  register: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '註冊')
  }),
  check: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '檢查是否登入')
  }),
  checkEmail: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得驗證碼')
  }),
  verification: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '驗證驗證碼')
  }),
  resetPassword: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '重設密碼')
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '更新使用者資訊')
  }),
}

module.exports = userControllers
