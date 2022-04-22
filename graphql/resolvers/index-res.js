const auth = require('./auth-res');
const deleteres = require('./delete-res');
const comment = require('./comment-res');
const user = require('./user-res');
const message = require('./message-res');
const post = require('./post-res');
const like = require('./like-res')

module.exports = {
    auth,
    deleteres,
    comment,
    user,
    message,
    post,
    like
}