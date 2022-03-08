import React, { useState } from 'react';
import './editpost.css'
import image from '../arrow.png'
import { Link } from 'react-router-dom';
import DropZone from './dropzone';
import { useNavigate } from 'react-router-dom';
export default function EditPost(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
const [curtitle, setcurtitle] = useState('')
let imagesrc= ''

  if(document.getElementById('files-here')){
    if( document.getElementById('files-here').childNodes.length > 0){
      imagesrc= document.getElementById('files-here').childNodes[0].src
      console.log(imagesrc)
    }
  }

  function handlePost(){  
    console.log('yr', document.getElementById('files-here'))
    let graphqlQuery = {
    query: `
      mutation {
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
      }
    `
  }
  fetch('http://localhost:8080/graphql',{
    method: "POST",
    body: JSON.stringify(graphqlQuery),
    headers: {
      Authorization:token,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(resData => {
      if(resData.errors){
        navigate('/error-page')
      }
      console.log(resData)
    })
    .catch(err => console.log(err))
  }
  return (
    <div id='edit-post-container'>
      <button id='goback-profile-from-edit'>
        <Link to='/'>
          <img id='goback'alt='logo' src={image}/>     
        </Link> 
      </button>
      <input 
            placeholder='Edit your post here' 
            name='post-title' 
            value={curtitle} 
            onChange={(event) => setcurtitle(event.target.value)} 
            className="post-input"
        />
        <DropZone></DropZone>

      <div id='edit-post-background'>
      <div id='files-here'></div>
      <button id='post-btn' onClick={handlePost}>Post</button>
      </div>
    </div>
  )
}