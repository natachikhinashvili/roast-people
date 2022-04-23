const User = require('../../postmodels/user');
const Post = require('../../postmodels/post');        
const fs = require('fs');
const mongodb = require('mongodb');

module.exports = {
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
        const client = new mongodb.MongoClient('mongodb+srv://newuser:p_a_s_w_o_r_d@cluster0.ezcie.mongodb.net/messages');
        console.log('her')
        const uri = 'mongodb://localhost:27017';
        
        client.connect(function(error) {
        console.log('still alive')
          const db = client.db('messages');
        
          var bucket = new mongodb.GridFSBucket(db);
        
          fs.createReadStream(`./${imageUrl}`).
            pipe(bucket.openUploadStream(`${imageUrl}`)).
            on('error', function(error) {
                console.log(error)
            }).
            on('finish', function() {
              console.log('done!');
              process.exit(0);
            });
        });
        
        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            likes: 0
        };
    },
    usersposts: async function({id}, req){
        const posts = await Post.find( {creator: id})
        return posts
    },
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
            updatedAt: updatedPost.updatedAt.toISOString() 
        }
    },
    posts: async function(args, req){
        const posts = await Post.find().populate('creator');
        return posts
    },
    post: async function({id}, req){
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
    }
}