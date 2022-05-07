const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/user')
const User = require('../models/UsersModel')
const appError = require('../service/appError')

router.get('/', userControllers.getAllUsers)

router.post('/login', userControllers.logIn)
router.post('/logout', userControllers.logOut)
router.post('/register', userControllers.register)
router.post('/check', userControllers.check)
router.post('/checkEmail', userControllers.checkEmail)
router.post('/verification', userControllers.verification)

router.patch('/resetPassword', userControllers.resetPassword)
router.patch('/profile', userControllers.updateProfile)
module.exports = router
