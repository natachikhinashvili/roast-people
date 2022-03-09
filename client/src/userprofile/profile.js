import './profile.css'
import image from '../arrow.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UsersPost from './userspost';
import React from 'react';
import {FiLoader} from "react-icons/fi";
function Profile(){
    const [state, setState] = useState({name : '', posts: [], imagesrc: ''})
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    useEffect(() => {  
    const qraphqlQuery = {
        query: `
            {
                user {
                    name
                    posts {
                        _id
                    }
                    pic
                }
                usersposts {
                    title
                    createdAt
                    imageUrl
                }             
            }
        `
    }  
    fetch('https://roast-people.herokuapp.com/graphql',
    { 
      method: "POST",
      headers: {
        Authorization: token, //bearer+token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qraphqlQuery)
    }
    )
    .then(res => res.json())
    .then(resData => {
      if(resData.errors){
          console.log(resData)
          navigate('/error-page')
      }
      console.log(resData)
      setState({name: resData.data.user.name, posts: resData.data.usersposts, imagesrc: resData.data.user.pic})
    })
    .catch(err => console.log(err))
 }, [])

    return (
        <div id='profile-container'>
            <Link to='/'>
                <button id='goback-profile-to-home'>
                    <img id='goback'alt='logo' src={image}/>
                </button>
            </Link>
            <div id='profile-container-body'>      
            {state.name === '' ? <div id='profile-loader'><FiLoader color='#ffff'/></div> : (
<div id='header'>
{state.imagesrc &&<img alt='profile' src={state.imagesrc}/>}
    <h1 id='username-profile'>{state.name}</h1>
    <div id ='profileposts'>{state.posts.map((post) => <UsersPost post={post}/>)}</div>
</div>
            )}      
            </div>
        </div>
    )
}

export default Profile;