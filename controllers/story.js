const successHandle = require('../server/handle')
const StoryModel = require('../models/StoryModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const mongoose = require('mongoose')

const storyControllers = {
  addStory: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '新增限時動態')
  }),
  deleteStory: handleErrorAsync(async (req, res, next) => {
    successHandle(res, '刪除限時動態')
  }),
}

module.exports = storyControllers
