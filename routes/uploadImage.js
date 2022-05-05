const express = require('express')
const router = express.Router()
const multer = require('multer')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.CLIENT_ID })
const fs = require('fs')
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
      cb(new Error('圖片格式錯誤，僅限 JPG、PNG、JPEG 圖片'))
    }
    cb(null, true)
  },

  storage,
}).single('image')

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).send({
        status: 'false',
        message: err.message,
      })
      return
    }
    if (req.file.size > 1000000) {
      res.status(400).send({
        status: 'false',
        message: '圖片檔案過大，僅限 1mb 以下檔案',
      })
      return
    }
    try {
      const response = await client.upload({
        image: fs.createReadStream(req.file.path),
        type: 'stream',
      })
      if (!response.success) {
        throw new Error(response.data)
      }
      res.status(200).send({
        status: 'success',
        data: {
          imageUrl: response.data.link,
        },
      })
    } catch (error) {
      res.status(400).send({
        status: 'false',
        error: error.message,
        message: '上傳失敗，請重新上傳',
      })
    }
  })
})

module.exports = router
