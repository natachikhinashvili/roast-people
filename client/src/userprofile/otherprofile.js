import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './profile.css'
import image from '../arrow.png'
import {FiLoader} from "react-icons/fi";
import { Link } from 'react-router-dom';
import UsersPost from './userspost';
function Othersprofile(){
    const slug = useParams()
    const token = localStorage.getItem('token')
    const [user,setuser] = useState([])
    const [posts,setposts] = useState([])

    useEffect(() => {
        const qraphqlQuery = {
            query: `
            {
                otheruser(id: "${slug.id}"){
                    _id
                    name
                    pic
                    posts{
                        title
                        imageUrl
                        createdAt
                    }
                }
            }` 
        }
        fetch('http://localhost:8080/graphql',     { 
            method: "POST",
            headers: {
              Authorization: token, //bearer+token
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(qraphqlQuery)
          })
          .then((res) => res.json())
          .then((user) => {
              console.log(user)
              setuser(user)
              setposts(user.data.otheruser.posts)
            }).catch((err) => console.log(err))
    }, [])
    console.log(user)
    return (
        <div id='otheruser-profile-body'>
        <Link to='/'>
            <button id='goback-otherprofile-to-home'>
                <img id='goback'alt='logo' src={image}/>
            </button>
        </Link>
        {!user.data ? <div id='otherprofile-loader'><FiLoader/> </div>: (
            <div>
            <div id='header'>
                <img src={user.data.otheruser.pic} id='otheruserprofile-pic' alt="" />
                <h1 id='otheruser-username'>{user.data.otheruser.name}</h1>
                </div>
                <div id='otheruser-map'>
                {user.data.otheruser.posts.map(post => <UsersPost post={post}/>)}
            </div> 
            </div>
        )}
        </div>
    )
}
export default Othersprofile;