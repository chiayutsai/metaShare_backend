const express = require('express')
const router = express.Router()
const checkUpload = require('../service/uploadImage')
const { isAuth } = require('../service/auth')
const uploadImageControllers = require('../controllers/uploadImage')

router.post('/', isAuth, checkUpload, uploadImageControllers.uploadImage)

module.exports = router
