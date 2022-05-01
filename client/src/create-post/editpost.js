import React, { useEffect, useState } from 'react';
import './editpost.css'
import {gql, useMutation} from '@apollo/client'
import GoBack from '../gobackfolder/goback'
import openSocket from 'socket.io-client'

export default function EditPost(){
  const userid = localStorage.getItem('userid')
  const [curtitle, setcurtitle] = useState('')
  let imagesrc = ''
  const socket = openSocket('https://roast-people.herokuapp.com/');

  if(document.getElementById('files-here') && document.getElementById('files-here').childNodes.length > 0){
    imagesrc = document.getElementById('files-here').childNodes[0].src
  }

  function onFileLoad(e) {

    if( e.currentTarget.files[0]) {
    const file = e.currentTarget.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let image = new Image();      
      image.src = fileReader.result
      setcurtitle('')
      image.className = 'post-image'
      image.style.maxHeight = '100px'
      image.style.maxWidth = '100px'
      document.getElementById('files-here').append(image)
    }
    fileReader.readAsDataURL(file);
  }
  }
    const ADD_POST = gql`
    mutation CreatePost{
      createPost(title: "${curtitle}", imageUrl: "${imagesrc}", id: "${userid}"){
        _id
        title
        imageUrl
        creator {
          name
         }
        createdAt
        likers{
          _id
        }
      }
    }
    ` 

  const [createPost]  = useMutation(ADD_POST)
  async function handlePost(e){  
    e.preventDefault()
    await createPost()
   // window.location.reload();
  }
  useEffect(() => {
    socket.once('post', (params) => {
      console.log(params)
      return socket.disconnect()
    })
  }, [socket])
  socket.emit('post' ,'o')
  return (
    <div id='edit-post-container'>
      <GoBack/>
      <div id='edit-area'>
      <textarea 
      id='editpost-textarea'
        placeholder='Edit your post here' 
        name='post-title' 
        value={curtitle} 
        onChange={(event) => setcurtitle(event.target.value)} 
      ></textarea>
        <div id="draggable-container" style={{display: curtitle !== '' && 'none' }}>
          <label className="custom-file-upload">
            <input 
              type="file"id="files"
              name="file-browser-input"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={onFileLoad}
              onChange={onFileLoad}/>
          </label>
        </div>
      </div>
      <div id='edit-post-background'>
        <div id='files-here'></div>
        <button id='post-btn' disabled={curtitle === ''} className={curtitle === '' ? 'disabled' : 'valid'}onClick={handlePost}>Post</button>
      </div>
    </div>
  )
}