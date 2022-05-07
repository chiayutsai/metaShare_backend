const successHandle = require('../server/handle')
const StoryModel = require('../models/StoryModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const storiesControllers = {
  getAllStories: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '取得限時動態')
  }),
}

module.exports = storiesControllers
