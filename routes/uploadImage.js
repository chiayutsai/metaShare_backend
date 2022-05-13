const express = require('express')
const router = express.Router()
const checkUpload = require('../service/uploadImage')

const uploadImageControllers = require('../controllers/uploadImage')

router.post('/', checkUpload, uploadImageControllers.uploadImage)

module.exports = router
