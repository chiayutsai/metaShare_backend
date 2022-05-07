const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const userRouter = require('./routes/user')
const postsRouter = require('./routes/posts')
const postRouter = require('./routes/post')
const storiesRouter = require('./routes/stories')
const storyRouter = require('./routes/story')
const likesPostRouter = require('./routes/likesPost')
const followRouter = require('./routes/follow')
const uploadImageRouter = require('./routes/uploadImage')
const { resErrorProd, resErrorDev } = require('./service/resError')

require('./connections')
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason)
  // 記錄於 log 上
})

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/user', userRouter)
app.use('/api/posts', postsRouter)
app.use('/api/post', postRouter)
app.use('/api/stories', storiesRouter)
app.use('/api/story', storyRouter)
app.use('/api/likesPost', likesPostRouter)
app.use('/api/follow', followRouter)
app.use('/api/uploadImage', uploadImageRouter)

app.use((req, res, next) => {
  res.status(404).json({
    status: 'false',
    message: '無此網路路由',
  })
})

app.use(function (error, req, res, next) {
  error.statusCode = error.statusCode || 500
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(error, res)
  }
  // mongoose 欄位錯誤
  if (error.name === 'ValidationError') {
    let errorFiled = ''
    Object.keys(error.errors).forEach((item) => {
      errorFiled += item
    })

    error.message = `${errorFiled}資料欄位未填寫正確，請重新輸入！`
    error.isOperational = true
    return resErrorProd(error, res)
  }
  resErrorProd(error, res)
})

module.exports = app
