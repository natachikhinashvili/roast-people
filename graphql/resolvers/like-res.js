const User = require('../../postmodels/user');
const Like = require('../../postmodels/like'); 

module.exports = {
    likepost: async function({userid, postid}, req){
        const user = await User.findById(userid)
        const foundpost = await Post.findById(postid)
        let likefound = await Like.find({liker: user, post: foundpost})
        if(likefound.length === 0){
          const like = new Like({
            liker: user,
            post: foundpost
          });
          const createdlike = await like.save()
          foundpost.likers.push(createdlike)
          await foundpost.save()
          return true 
        }else{
          let filtered = foundpost.likers.filter(like => likefound[0]._id.toString() !== like.toString())
          foundpost.likers = filtered
          await Like.findByIdAndRemove(likefound[0]._id)
          return false
        }
      },
      likes: async function({postid}, req){
        const foundpost = await Post.findById(postid)
        const likes = await Like.find({post: foundpost})
        return likes
      }
}