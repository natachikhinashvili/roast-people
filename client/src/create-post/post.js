import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import  { Link } from 'react-router-dom';
import './post.css'
import {gql, useQuery, useMutation} from '@apollo/client'
import { FiThumbsUp } from 'react-icons/fi'
const Post = ({ creatorid, post, user, profile }) => {
    const token = useSelector((state) => state.token.token);
    const [like, setlike] = useState(0)
    const userId = localStorage.getItem('userid')
    const loadlikegraphqlQuery = gql`
            query {
                post(id: "${post._id}"){
                    likes
                }
            }
        `
    const deletepostquery = gql`
            mutation DeletePost{
                deletePost(id: "${post._id}")
            }
        `
    const likeQuery = gql`
            mutation {
                likepost(id: "${post._id}", userid: "${userId}"){
                    likes
                }
            }
        `
    const  {error, loading, data} = useQuery(loadlikegraphqlQuery)
    const [deletePost] = useMutation(deletepostquery)
    const [likepost] = useMutation(likeQuery)
    useEffect(() => {
        if(data){
        console.log(data)
        setlike(data.post.likes)
        }
}, [post._id, token, likepost,data,loading,error])
    function likehandler(){
        likepost()
    }
    function deletehandler(){
        deletePost()
    }
    return (
        <div id='post'>
            <div id='post-settings'>
                <Link to={userId === creatorid ? '/profile' : '/profile/' + creatorid}  style={{ textDecoration: 'none', color: 'white' }} > 
                    <img alt='profile' src={profile} id='profile-pic'/>
                </Link>
                <div id='feed-post-creator-createdAt'>
                    <h3>{user}</h3>
                    <h4 id="post-createdAt">{ post.createdAt.toString().slice(0,21) }</h4>
                </div>
            </div>
            <h1 id="post-title">{post.title}</h1>
            <div id='pic-container'>
                {post.imageUrl !== '' && <img src={post.imageUrl} id='post-pic' alt='post'/>}
            </div>
            <div>
                <button id='like' onClick={likehandler}>
                    <FiThumbsUp color='#fff'></FiThumbsUp> | {like}
                </button>
                <button id='like'>
                    <Link style={{textDecoration: 'none',color: 'white'}} to={'/post/comments/' + post._id}>
                        comments
                    </Link>
                </button>
                {creatorid === userId && <button id="delete-button" onClick={deletehandler}>delete</button>}
            </div>
        </div>
    )
}

export default Post