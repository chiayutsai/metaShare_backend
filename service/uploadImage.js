const multer = require('multer')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')

const storage = multer.memoryStorage()

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

const checkUpload = handleErrorAsync(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(appError(400, err.message))
    }
    if (!req.file) {
      return next(appError(400, '請選擇一張圖片上傳'))
    }
    if (req.file?.size > 1000000) {
      return next(appError(400, '圖片檔案過大，僅限 1mb 以下檔案'))
    }
    next()
  })
})

module.exports = checkUpload
