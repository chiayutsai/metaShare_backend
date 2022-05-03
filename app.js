const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const postsRouter = require('./routes/posts')

require('./connections')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/posts', postsRouter)

app.use((req, res, next) => {
  res.status(404).json({
    status: 'false',
    message: '無此網路路由',
  })
})
module.exports = app
