
import React, { useState } from 'react';
import './editpost.css'
import { useNavigate } from 'react-router-dom';
import {gql, useMutation} from '@apollo/client'
import GoBack from '../gobackfolder/goback'
export default function EditPost(){
  const userid = localStorage.getItem('userid')
  const navigate = useNavigate()
const [curtitle, setcurtitle] = useState('')
const [imagesrc, setimagesrc] =useState('')

  if(document.getElementById('files-here') && document.getElementById('files-here').childNodes.length > 0){
      setimagesrc(document.getElementById('files-here').childNodes[0].src)
      setcurtitle('')
  }

  function onFileLoad(e) {
    //Get current selected or dropped file (it gives you the ability to load multiple images).
    if( e.currentTarget.files[0]) {
    const file = e.currentTarget.files[0];
    //Create instance 
    let fileReader = new FileReader();
    //Register event listeners
    fileReader.onload = () => {
     let image = new Image();
     setimagesrc(image.src)
     image.src = fileReader.result
     image.className = 'post-image'
     document.getElementById('files-here').append(image)
    }
    //Read the file as a Data URL (which gonna give you a base64 encoded image data)
    fileReader.readAsDataURL(file);

    console.log(e.currentTarget.files[0])
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
        likes
      }
    }
    `

  const [createPost]  = useMutation(ADD_POST)
  async function handlePost(e){  
    e.preventDefault()
    await createPost()
    navigate('/feed')
  }
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
      <div id="draggable-container">
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