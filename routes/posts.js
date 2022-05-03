const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postsControllers = require('../controllers/posts')

router.get('/', postsControllers.getPosts)

router.post('/', postsControllers.addPosts)

router.delete('/', postsControllers.deleteAllPosts)

router.delete('/:id', postsControllers.deletePost)

router.patch('/:id', postsControllers.updatePost)

module.exports = router
