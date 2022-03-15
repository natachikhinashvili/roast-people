
import React, { useState } from 'react';
import './editpost.css'
import image from '../arrow.png'
import { Link } from 'react-router-dom';
import DropZone from './dropzone';
import {gql, useMutation} from '@apollo/client'
export default function EditPost(){
const [curtitle, setcurtitle] = useState('')
let imagesrc= ''

  if(document.getElementById('files-here')){
    if( document.getElementById('files-here').childNodes.length > 0){
      imagesrc= document.getElementById('files-here').childNodes[0].src
      console.log(imagesrc)
    }
  }


    const ADD_POST = gql`
    mutation CreatePost{
      createPost(postInput: {title: "${curtitle}", imageUrl: "${imagesrc}"}){
        _id
        title
        imageUrl
        creator {
          name
         }
        createdAt
        likes
      }
    }`

    const [createPost, {create_message_data}]  = useMutation(ADD_POST)
  function handlePost(e){  
    e.preventDefault()
    createPost()
  }
  return (
    <div id='edit-post-container'>
      <button id='goback-profile-from-edit'>
        <Link to='/'>
          <img id='goback'alt='logo' src={image}/>     
        </Link> 
      </button>
        <textarea 
        id='editpost-textarea'
        placeholder='Edit your post here' 
        name='post-title' 
        value={curtitle} 
        onChange={(event) => setcurtitle(event.target.value)} 
        ></textarea>
          <DropZone></DropZone>

      <div id='edit-post-background'>
      <div id='files-here'></div>
      <button id='post-btn' onClick={handlePost}>Post</button>
      </div>
    </div>
  )
}