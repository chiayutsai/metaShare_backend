const { successHandle, errorHandle } = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')

const postsControllers = {
  async getPosts(req, res) {
    const post = await Post.find().populate({
      path: 'author',
      select: 'name avator',
    })
    successHandle(res, post)
  },

  async addPosts(req, res) {
    try {
      const data = req.body
      const post = await Post.create(req.body)
      successHandle(res, post, '新增成功')
    } catch (error) {
      errorHandle(res, error, '欄位填寫不正確')
    }
  },

  async deleteAllPosts(req, res) {
    try {
      await Post.deleteMany({})
      successHandle(res, [], '刪除全部成功')
    } catch (error) {
      errorHandle(res, error, error.message)
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params
      const post = await Post.findByIdAndDelete(id)
      if (post) {
        successHandle(res, post, '刪除成功')
      } else {
        throw new Error()
      }
    } catch (error) {
      errorHandle(res, error, '查無此 id')
    }
  },

  async updatePost(req, res) {
    try {
      const { id } = req.params
      const data = req.body
      const post = await Post.findByIdAndUpdate(
        id,
        { name: data.name, content: data.content, image: data.image, createdAt: data.createdAt, likes: data.likes },
        { returnDocument: 'after' }
      )
      if (post) {
        successHandle(res, post, '更新成功')
      } else {
        throw new Error('無此ID或欄位填寫錯誤')
      }
    } catch (error) {
      errorHandle(res, error, '查無此 id')
    }
  },
}

module.exports = postsControllers
