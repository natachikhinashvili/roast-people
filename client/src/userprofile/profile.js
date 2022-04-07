import './profile.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import {FiLoader,FiSettings} from "react-icons/fi";
import {gql, useQuery} from '@apollo/client'
import Post from '../create-post/post';

import GoBack from '../gobackfolder/goback'

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
    const {error, loading, data} = useQuery(LOAD_user)
    useEffect(() => {  
        if(error){
            console.log(error)
        }
        if(data){
            setState({name: data.user.name , posts: data.usersposts, imagesrc: data.user.pic, id: data.user._id})
        }
    }, [data,loading,error])
    return (
        <div id='profile-container'>
        <Link to='/settings'>
          <button id='settings'> 
            <FiSettings  color='#9f6cff'/>
          </button>
        </Link>
            <GoBack/>
            <div id='profile-container-body'>      
                {state.name === '' ? <div id='profile-loader'><FiLoader color='#ffff'/></div> : (
                <div id='header'>
                    {state.imagesrc &&<img alt='profile' id='myprofile' src={state.imagesrc}/>}
                    <h1 id='username-profile'>{state.name}</h1>
                    {state.posts.length === 0 ? <h1>no posts found</h1>:<div id ='profileposts'>{state.posts.map((post) => <Post creatorid={state.id} user={state.name} profile={state.imagesrc} post={post}/>)}</div>}
                </div>
                )}      
            </div>
        </div>
    )
}

export default Profile;