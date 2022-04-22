const Post = require('../../postmodels/post');
const User = require('../../postmodels/user');

module.exports = {
  deleteAccount: async function({userid},req){
    await User.findOneAndRemove(userid)
    return true
  },
  deletePost: async function({id, userid}, req){
    const post = await Post.findById(id)
    if(!post) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    } 
    await Post.findByIdAndRemove(id);
    const user = await User.findById(userid)
    user.posts.pull(id)
    await user.save()
    return true
  }
}