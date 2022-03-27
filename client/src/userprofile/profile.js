import './profile.css'
import image from '../arrow.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import {FiLoader} from "react-icons/fi";
import {gql, useQuery} from '@apollo/client'
import Post from '../create-post/post';

const userId = localStorage.getItem('userid')
const LOAD_user = gql`
    query {
        user(id: "${userId}") {
            _id
            name
            pic
        }  
        usersposts(id: "${userId}"){
            _id
            title
            createdAt
            imageUrl
        }
    }
`
function Profile(){
    const [state, setState] = useState({name : '', posts: [], imagesrc: ''})
    const navigate = useNavigate()
    const {error, loading, data} = useQuery(LOAD_user)
    useEffect(() => {  
        if(error){
            console.log(error)
        }
        if(data){
            setState({name: data.user.name , posts: data.usersposts, imagesrc: data.user.pic, id: data.user._id})
        }
    }, [data,loading,error, navigate])
    
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
                    {state.imagesrc &&<img alt='profile' id='myprofile' src={state.imagesrc}/>}
                    <h1 id='username-profile'>{state.name}</h1>
                    <div id ='profileposts'>{state.posts.map((post) => <Post creatorid={state.id} user={state.name} profile={state.imagesrc} post={post}/>)}</div>
                </div>
                )}      
            </div>
        </div>
    )
}

export default Profile;