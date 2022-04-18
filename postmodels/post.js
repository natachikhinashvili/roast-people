const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },    
    imageUrl: {
        type: String,
        required: false
    },    
    createdAt: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)