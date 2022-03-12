import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './profile.css'
import image from '../arrow.png'
import {FiLoader} from "react-icons/fi";
import { Link } from 'react-router-dom';
import Post from '../create-post/post';
import {gql, useQuery} from '@apollo/client'
import { useNavigate } from 'react-router-dom';

function Othersprofile(){
    const slug = useParams()
    const [user,setuser] = useState([])
    const navigate = useNavigate()

    const LOAD_user = gql`
    query {
        otheruser(id: "${slug.id}"){
            _id
            name
            pic
            posts{
                _id
                title
                imageUrl
                createdAt
            }
        }
    }
`
const {error, loading, data} = useQuery(LOAD_user)
    useEffect(() => {
        console.log(loading,error,data)
        if(data){
            setuser(data)
        }
      if(error){
        navigate('/error-page')
      }
    }, [slug.id,data,loading,error,navigate])
    return (
        <div id='otheruser-profile-body'>
        <Link to='/'>
            <button id='goback-otherprofile-to-home'>
                <img id='goback'alt='logo' src={image}/>
            </button>
        </Link>
        {!user.otheruser ? <div id='otherprofile-loader'><FiLoader/> </div>: (
            <div>
            <div id='header'>
                <img src={user.otheruser.pic} id='otheruserprofile-pic' alt="" />
                <h1 id='otheruser-username'>{user.otheruser.name}</h1>
                </div>
                <div id='otheruser-map'>
                    {user.otheruser.posts.map(post => <Post key={post._id} profile={user.otheruser.pic} user={user.otheruser.name} post={post}/>)}
                </div> 
            </div>
        )}
        </div>
    )
}
export default Othersprofile;