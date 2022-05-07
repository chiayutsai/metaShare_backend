const successHandle = require('../server/handle')
const FollowModel = require('../models/FollowModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const followControllers = {
  getFollow: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得追蹤名單/被誰追蹤')
  }),
  updateFollow: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '更新追蹤名單/被誰追蹤')
  }),
}

module.exports = followControllers
