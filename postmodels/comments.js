const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: String,
        required: false
    },
    place: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Comment' , commentSchema)