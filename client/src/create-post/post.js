import React, { useEffect, useState } from 'react';
import  { Link } from 'react-router-dom';
import './post.css'
import {gql, useQuery, useMutation} from '@apollo/client'
import openSocket from 'socket.io-client'
import { FiThumbsUp } from 'react-icons/fi'
const Post = ({ creatorid, post, user, profile }) => {
    const [like, setlike] = useState(0)
    const [liked, setliked] = useState(false)
    const socket = openSocket('http://localhost:8080/');
    const [likecount, setlikecount] = useState(0)
    const userId = localStorage.getItem('userid')

    const loadlikegraphqlQuery = gql`
            query {
                likes(postid: "${post._id}") {
                    _id
                    liker {
                        _id
                    }
                }
            }
        `
    const deletepostquery = gql`
            mutation DeletePost{
                deletePost(id: "${post._id}", userid: "${userId}")
            }
        `
    const likeQuery = gql`
            mutation Likepost{
                likepost(userid: "${userId}", postid: "${post._id}"){
                    liker{
                        name
                    }
                }
            }
        `
    const  {error, loading, data} = useQuery(loadlikegraphqlQuery)
    const [deletePost] = useMutation(deletepostquery)
    const [likepost] = useMutation(likeQuery)
    useEffect(() => {
        if(data){
            setlike(data.likes)
            setlikecount(like.length)
        }
    }, [post._id, likepost,data,loading,error,like])
    async function likehandler(){
        await likepost().catch(err => console.log(err))
        if(like.length === 0){
            if(liked){
                socket.emit('like' , setlikecount(prevstate => prevstate - 1))
                setliked(false)
            }else{
                socket.emit('like' , setlikecount(prevstate => prevstate + 1))
                setliked(true)
            }
        }else{
            let filtered = like.filter(onelike => onelike.liker._id !== userId)
             if(filtered.length !== like.length && !liked){
                setlikecount(like.length)
                setliked(true)
            }else{
                setlikecount(filtered.length)
                setliked(false)
            }
        }
        socket.once('like', (like) => {
            return socket.disconnect()
        })
    }
    async function deletehandler(){
        await deletePost()
        window.location.reload();
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
            <div id='post-footer'>
                <button id='like' onClick={likehandler}>
                    <FiThumbsUp color='#fff' size={20}></FiThumbsUp> <p id='like-count'>{likecount}</p>
                </button>
                <button id='comment-btn'>
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