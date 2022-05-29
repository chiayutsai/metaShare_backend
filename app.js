const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')
const session = require('express-session')

require('./connections')

const createThirdPartyAuth = require('./service/thirdPartyAuth')
const swaggerFile = require('./swagger-output.json')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const storiesRouter = require('./routes/stories')
const storyRouter = require('./routes/story')
const likesPostRouter = require('./routes/likesPost')
const followRouter = require('./routes/follow')
const uploadImageRouter = require('./routes/uploadImage')
const { resErrorProd, resErrorDev } = require('./service/resError')

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

app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

const thirdPartyAuth = createThirdPartyAuth(app, {
  // baseUrl is optional; it will default to localhost if you omit it;
  // it can be helpful to set this if you're not working on
  // your local machine.  For example, if you were using a staging server,
  // you might set the BASE_URL environment variable to
  // https://staging.meadowlark.com
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
})
// auth.init() links in Passport middleware:
thirdPartyAuth.init()
// now we can specify our auth routes:
thirdPartyAuth.registerRoutes()

app.use('/api/user', userRouter)
app.use('/api', postRouter)
app.use('/api/stories', storiesRouter)
app.use('/api/story', storyRouter)
app.use('/api/likesPost', likesPostRouter)
app.use('/api/follow', followRouter)
app.use('/api/uploadImage', uploadImageRouter)

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

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
  }
  if (error instanceof SyntaxError && error.statusCode === 400 && 'body' in error) {
    console.error(error)
    error.message = `請輸入 JSON 格式`
    error.isOperational = true
  }
  resErrorProd(error, res)
})

module.exports = app
