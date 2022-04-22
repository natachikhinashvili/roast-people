const Comment = require('../../postmodels/comments'); 
const User = require('../../postmodels/user');

module.exports = {
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
      ...createComment._doc,
      _id: createComment._id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}