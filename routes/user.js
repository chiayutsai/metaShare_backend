const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const { isAuth, verificationAuth } = require('../service/auth')

router.get('/', userControllers.getAllUsers)

router.post('/register', userControllers.register)
router.post('/login', userControllers.logIn)
router.get('/check', isAuth, userControllers.check)

router.post('/checkEmail', userControllers.checkEmail)
router.post('/verification', verificationAuth, userControllers.verification)
router.patch('/resetPassword', verificationAuth, userControllers.resetPassword)

router.get('/profile', userControllers.getProfile)
router.patch('/profile', userControllers.updateProfile)
router.patch('/updatePassword', userControllers.updatePassword)
module.exports = router
