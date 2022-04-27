const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../postmodels/user');
const validator = require('validator');
const flash = require('connect-flash')

module.exports = {
    createUser: async function({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = 'User exists already!'
      console.log('err')
      throw flash('info', 'flash is not back its black');
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
      pic: userInput.pic
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
    login: async function({ email, password }) {
      const user = await User.findOne({ email: email });
      if (!user) {
        const error = new Error('User not found.');
        error.code = 401;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error('Password is incorrect.');
        console.log(error)
        error.code = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email
        },
        'somesupersecretsecret',
        { expiresIn: '24h' }
      );
      return { token: token, userId: user._id.toString() };
    }
}