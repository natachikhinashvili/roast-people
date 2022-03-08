const express = require('express')
const { body } = require('express-validator')
const User = require('../postmodels/user')
const authController = require('../controllers/auth')
const router = express.Router()
  router.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })
router.put('/signup',
authController.signup)

router.post('/login',authController.login)


router.get('/chat-users',authController.getChatUsers)

module.exports = router