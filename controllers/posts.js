const { successHandle, errorHandle } = require('../server/handle')
const Post = require('../models/PostsModel')
const User = require('../models/UsersModel')

const postsControllers = {
  async getPosts(req, res) {
    const { sort,search } = req.query
    const q = search !== undefined ? {"content": new RegExp(search)} : {};
    
    if (sort && sort !== 'news') {
      const post = await Post.aggregate([
        {
          $match: q
        },
        {
          $project: {
            author: 1,
            content: 1,
            comments: 1,
            imageUrls: 1,
            likes: 1,
            createdAt: 1,
            length: {
              $cond: { if: { $isArray: `$${sort}` }, then: { $size: `$${sort}` }, else: "NA"}
            },
          },
        },
        {
          $sort: {
            length: -1,
          },
        },
      ])
      await Post.populate(post, {
        path: 'author',
        select: 'name avator',
      })
      await Post.populate(post, {
        path: 'comments',
        populate: { path: 'commenter' },
      })
  
      successHandle(res, post)
    }else {
      const post = await Post.find(q)
        .populate({
          path: 'author',
          select: 'name avator',
        })
        .populate({
          path: 'comments',
          populate: { path: 'commenter' },
        })
        .sort({ createdAt: -1 })
      successHandle(res, post)
    }
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
