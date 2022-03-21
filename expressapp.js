const express = require("express");
const mongoose = require('mongoose')
const graphqlHttp = require('express-graphql').graphqlHTTP
const cors = require('cors');
const path = require('path');
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const auth = require('./middleware/is-auth')
const routes = require('./routes/feed')
var wrtc = require('wrtc')
const authroutes = require('./routes/auth');
const app = express();

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, "./client/build")));
}

app.use(cors())
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next();
})
app.use(auth)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err) {
    if(!err.originalError){
      return err
    }
    const data = err.originalError.data
    const message = err.message || 'An error occurred';
    const code = err.originalError.code || 500;
    return {message: message, status: code, data: data}
  }
}))

app.use((error,req,res,next) => {
  const status = error.statusCode || 500
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data})
})
app.use(routes)
app.use('/auth', authroutes)
mongoose
.connect('mongodb+srv://newuser:p_a_s_w_o_r_d@cluster0.ezcie.mongodb.net/messages')
.then(result => {
  const port = process.env.PORT || 8080   
  const io = require('socket.io')(app.listen(port), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    secure: true
  })
  
  io.on('connection', (socket) => {
    socket.on('message', (message)  =>{
      console.log(message)
      io.emit('message', `${message}`)
    })    
  })
})
.catch(err => console.log(err));