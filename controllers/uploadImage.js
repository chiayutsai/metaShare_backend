const { ImgurClient } = require('imgur')
const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN,
})
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const successHandle = require('../server/handle')

const uploadImageControllers = {
  uploadImage: handleErrorAsync(async (req, res, next) => {
    const response = await client.upload({
      image: req.file.buffer,
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
