const Post = require('../../postmodels/post'); 
const User = require('../../postmodels/user');

module.exports = {
  users: async function(args,req){
    const userslist = await User.find()
    return userslist;
  },
  user: async function({id}, req){ 
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
};