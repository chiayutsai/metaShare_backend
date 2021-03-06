const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const { isAuth, verificationAuth } = require('../service/auth')
const { checkUserId } = require('../service/checkId')

router.get('/', isAuth, userControllers.getUsers)
router.post('/register', userControllers.register)
router.post('/login', userControllers.logIn)
router.get('/check', isAuth, userControllers.check)

router.post('/checkEmail', userControllers.checkEmail)
router.post('/verification', userControllers.verification)
router.patch('/resetPassword', verificationAuth, userControllers.resetPassword)

router.get('/profile/:id', isAuth, checkUserId, userControllers.getProfile)
router.patch('/profile', isAuth, userControllers.updateProfile)
router.patch('/updatePassword', isAuth, userControllers.updatePassword)
module.exports = router
