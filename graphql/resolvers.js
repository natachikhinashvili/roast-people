const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../postmodels/user');
const Post = require('../postmodels/post'); 
const Comment = require('../postmodels/comments'); 
const Message = require('../postmodels/message')
module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
      pic: userInput.pic
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });
    console.log('executing')
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      console.log(error)
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      'somesupersecretsecret',
      { expiresIn: '24h' }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function({ title, imageUrl, id }, req) {
    const user = await User.findById(id)
    const post = new Post({
      title: title,
      imageUrl: imageUrl,
      creator: user,
      like: 0
    });
    const createdPost = await post.save()
    user.posts.push(createdPost);
    await user.save()
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      likes: 0
    };
  },
  createMessage: async function({ text,place,id }, req){
    const user = await User.findById(id)
    if(!user){
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    const message = new Message({
      text: text,
      creator: user,
      place: place
    });
    const createdMessage = await message.save();
    user.messages.push(createdMessage);
    await user.save()
    return {
      ...createdMessage._doc,
      _id: createdMessage._id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  messages: async function({id}, req){
    const user = await User.findById(id)
    const messages = await Message.find().populate('creator')
    return messages 
  },

  usersposts: async function({id}, req){
    const posts = await Post.find( {creator: id})
    return posts
  },
  users: async function(args,req){
    const userslist = await User.find()
    return userslist;
  }
  ,

  updatePost: async function({id, text,place}, req){
    if(!req.isAuth){
      const error = new Error('Not authenticated!')
      error.code = 401;
      throw error
  }
  const post = await Post.findById(id).populate('creator')
  if(!post) {
    const error = new Error('No post found!')
    error.code = 404
    throw error
  } 
  if(post.creator._id.toString() === req.userId.toString()){
    const error = new Error('Not authorized!')
    error.code = 403;
    throw error
  }
  const errors = [];
  if (
    validator.isEmpty(postInput.title) ||
    !validator.isLength(postInput.title)
  ) {
    errors.push({ message: 'Title is invalid.' });
  }
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  post.title = postInput.title
  if(postInput.imageUrl !== 'undefined') {

    post.imageUrl = postInput.imageUrl
  }
  const updatedPost = await post.save();
  return {
    ...updatedPost._doc, 
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString() }
  },
  deletePost: async function({id}, req){
    //const token = localStorage.getItem('token')
    //if(!req.isAuth & !token){
    //  const error = new Error('Not authenticated!')
    //  error.code = 401;
    //  throw error
    //}
    const post = await Post.findById(id)
    if(!post) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    } 
    //if(post.creator.toString() === req.userId.toString()){
    //  const error = new Error('Not authorized!')
    //  error.code = 403;
    //  throw error
    //}
    await Post.findByIdAndRemove(id);
    const user = await User.findById(req.userId)
    user.posts.pull(id)
    await user.save()
    return true
  },
  user: async function({id}, req){ 

    //if(!req.isAuth){
    //  const error = new Error('Not authenticated!')
    //   error.code = 401;
    //  throw error
    //}
    console.log(id)
    const user = await User.findById(id)
    if(!user) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    } 
    return {
      ...user._doc,
     _id: user._id.toString()
    }
  },
  updateStatus: async function({status}, req){

    if(!req.isAuth){
      const error = new Error('Not authenticated!')
      error.code = 401;
      throw error
    }
    const user = await User.findById(req.userId)
    if(!user) {
      const error = new Error('user not found!')
      error.code = 404
      throw error
    }
    user.status = status
    await user.save() 

    return {
      ...user._doc,
      _id: user._id.toString()
    }
  },

  posts: async function(args, req){
  const posts = await Post.find().populate('creator');
  return posts
  },

  post: async function({id}, req){
 //   if(!req.isAuth){
 //     const error = new Error('Not authenticated!')
 //     error.code = 401;
 //     throw error
 // }
  const post = await Post.findById(id).populate('creator')
  if(!post) {
    const error = new Error('No post found!')
    error.code = 404
    throw error
  }
  return {
    ...post._doc,
    creator: post.creator,
    _id: post._id.toString(),
    likes: post.like
  }
},
otheruser: async function({id}, req){
  const user = await User.findById(id)
  if(!user) {
    const error = new Error('No post found!')
    error.code = 404
    throw error
  } 
  const posts = await Post.find( {creator: id})
  return {
    ...user._doc,
   _id: user._id.toString(),
   posts: posts
  }
},
likepost: async function({id, userid}, req){
  const post = await Post.findById(id)
  const user = await User.findById(userid)
  let liked = false
  user.likedposts.map(post => {
    liked = post._id.toString() === id
  })
  if(liked){
    post.like -= 1
    user.likedposts.splice(user.likedposts.indexOf(post), 1)
  }else{
    post.like += 1
    user.likedposts.push(post)
  }
  const saved = await post.save()
  await user.save()
  return {
    likes : saved.like
  }
},
  addroaster: async function({userid, myid}, req){
    const user = await User.findById(myid)
    const otheruser = await User.findById(userid)
    user.roasters.push(otheruser);
    return user
  },
  comments: async function({id}, req){
    const comments = await Comment.find({place: id}).populate('creator')
    return comments 
  },
  addComment: async function({ text,place,id }, req){
    const user = await User.findById(id)
    if(!user){
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    const comment = new Comment({
      text: text,
      creator: user,
      place: place
    });
    const createComment = await comment.save();
    user.comments.push(createComment);
    await user.save()
    return {
      ...createdMessage._doc,
      _id: createdMessage._id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};