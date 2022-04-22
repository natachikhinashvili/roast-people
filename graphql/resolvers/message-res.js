const Message = require('../../postmodels/message');
const User = require('../../postmodels/user');

module.exports = {
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
    }
}