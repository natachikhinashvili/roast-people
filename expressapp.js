const express = require("express");
const mongoose = require('mongoose')
const graphqlHttp = require('express-graphql').graphqlHTTP
const cors = require('cors');
const path = require('path');
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers/index-res')
const app = express();
const fs = require('fs')
const mongodb = require('mongodb')

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
app.use('*', (req,res,next) => {
  return res.send('something went wrong')
})
 mongoose
.connect('mongodb+srv://newuser:p_a_s_w_o_r_d@cluster0.ezcie.mongodb.net/messages')
.then(result => 
  {
  const io = require('socket.io')(app.listen(8080), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  })
  
  io.on('connection', (socket) => {
    socket.on('message', (message)  =>{
      io.emit('message', `${message}`)
    })
    socket.on('comment', (comment)  =>{
      io.emit('comment', `${comment}`)
    })
    socket.on('like', (like)  =>{
      io.emit('like', `${like}`)
    })
  })
})
.catch(err => console.log(err));

const client = new mongodb.MongoClient('mongodb+srv://newuser:p_a_s_w_o_r_d@cluster0.ezcie.mongodb.net/messages');
client.connect(function(error) {
  console.log(error)
  const db = client.db('messages');

  var bucket = new mongodb.GridFSBucket(db);
  console.log(bucket)
 // fs.createReadStream('./myFile').
 //    pipe(bucket.openUploadStream('myFile', {
 //        chunkSizeBytes: 1048576,
 //        metadata: { field: 'myField', value: 'myValue' }
 //    }))
//
//
 // // Use bucket...
});