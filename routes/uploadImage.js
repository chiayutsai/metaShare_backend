const express = require('express')
const router = express.Router()
const multer = require('multer')
const appError = require('../service/appError')
// 設定 storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  // 設定檔案命名方式
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(null, false)
      return cb(new Error('圖片格式錯誤，僅限 JPG、PNG、JPEG 圖片'))
    }
    cb(null, true)
  },

  storage,
}).single('image')

const checkUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(appError(400, err.message))
    }
    if (req.file.size > 1000000) {
      return next(appError(400, '圖片檔案過大，僅限 1mb 以下檔案'))
    }
    next()
  })
}
const uploadImageControllers = require('../controllers/uploadImage')

router.post('/', checkUpload, uploadImageControllers.uploadImage)

module.exports = router
