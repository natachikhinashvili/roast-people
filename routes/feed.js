const express = require('express')
const feedController = require('../controllers/controller')
const { body } = require('express-validator')
const router = express.Router()
const isAuth = require('../middleware/is-auth')
  router.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })
router.post('/post',feedController.createPosts)

router.get('/post', feedController.getPosts)

router.get('/post/:postId', feedController.getPost)

router.put('/post/:postId' , feedController.updatePost)
router.delete('/post/:postId',isAuth, feedController.deletePost)
module.exports=router