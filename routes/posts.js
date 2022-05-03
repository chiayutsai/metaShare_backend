const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postsControllers = require('../controllers/posts')

router.get('/', postsControllers.getPosts)

router.post('/', postsControllers.addPosts)

router.delete('/', postsControllers.deleteAllPosts)

router.delete('/:id', postsControllers.deletePost)

router.patch('/:id', postsControllers.updatePost)

router.get('*', function(req, res){
  res.status(404).json({
    message:'查無此網路路由'
  });
});

module.exports = router
