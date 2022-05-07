const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.CLIENT_ID })
const fs = require('fs')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandle = require('../server/handle')

const uploadImageControllers = {
  uploadImage: handleErrorAsync(async (req, res, next) => {
    const response = await client.upload({
      image: fs.createReadStream(req.file.path),
      type: 'stream',
    })
    if (!response.success) {
      return next(appError(400, '上傳失敗，請重新上傳'))
    }
    successHandle(res, {
      imageUrl: response.data.link,
    })
  }),
}
module.exports = uploadImageControllers
