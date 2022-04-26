const User = require('../../postmodels/user');
const Post = require('../../postmodels/post');        
const fs = require('fs');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const multer = require('multer');
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

        let mongouri = 'mongodb+srv://newuser:p_a_s_w_o_r_d@cluster0.ezcie.mongodb.net/messages'
        const client = await mongoose.connect(mongouri);
        let gfs = Grid(client, mongoose.mongo);
        //const source = fs.createReadStream('image.png', {filename: 'image.png'})
        //const writeStream = gfs.createWriteStream({
        //    root: "images",
        //    filename: "image.png"
        // });
        // source.pipe(writeStream)
        //console.log('d')
        //fs.createReadStream(`${imageUrl}`).
        //pipe(bucket.openUploadStream('meistersinger.mp3')).
        //on('error', function(error) {
        //  assert.ifError(error);
        //}).
        //on('finish', function() {
        //  console.log('done!');
        //  process.exit(0);
        //});
        const storage = new GridFsStorage({
            url: mongouri,
            file: (req, file) => {
              return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                  if (err) {
                    return reject(err);
                  }
                  const filename = buf.toString('hex') + path.extname(file.originalname);
                  const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                  };
                  resolve(fileInfo);
                });
              });
            }
          });
        const upload = multer({ storage });
        upload.single(`${imageUrl}`)

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