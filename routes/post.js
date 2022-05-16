const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const postControllers = require('../controllers/post')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')
const appError = require('../service/appError')
const { isAuth } = require('../service/auth')
const {checkPostId} = require('../service/checkId')

router.get('/posts', isAuth, postControllers.getPosts)
router.get('/posts/user/:userId', isAuth, postControllers.getPosts)

router.get('/post/:id', isAuth, checkPostId, postControllers.getPost)

router.get('/post/:id/likes', isAuth, checkPostId, postControllers.getPostLikes)

router.get('/post/:id/comments', isAuth, checkPostId, postControllers.getPostComments)

router.post('/post/', isAuth, postControllers.addPost)

router.delete('/post/:id', isAuth, checkPostId, postControllers.deletePost)

router.patch('/post/:id', isAuth, checkPostId, postControllers.updatePost)

router.patch('/post/:id/likes', isAuth, checkPostId, postControllers.updatePostLikes)

router.patch('/post/:id/comments', isAuth, checkPostId, postControllers.updatePostComments)
module.exports = router
