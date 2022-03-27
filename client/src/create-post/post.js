import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import  { Link, useNavigate } from 'react-router-dom';
import './post.css'
import { FiThumbsUp } from 'react-icons/fi'
const Post = ({ creatorid, post, user, profile }) => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.token.token);
    const [like, setlike] = useState(0)
    const [color, setcolor] = useState('#fff')
    const userId = localStorage.getItem('userid')
    useEffect(() => {

        const likegraphqlQuery = {
            query: `
                query {
                    post(id: "${post._id}"){
                        likes
                    }
                }
            `
        }
        fetch('https://roast-people.herokuapp.com/graphql', 
        {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likegraphqlQuery)
        }
        )
        .then(res => res.json())
        .then(result =>{
            setlike(result.data.post.likes)
        })
        .catch(err => console.log(err))
    }, [post._id, token])
    const graphqlQuery = {
        query: `
            mutation {
                deletePost(id: "${post._id}")
            }
        `
    }
    function deletehandler(){
        fetch('https://roast-people.herokuapp.com/graphql', 
        {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
    }
        )
        .then(res => res.json())
        .then(result => {
            navigate('/feed')
        })
        .catch(err => console.log(err))
    }
    function handleLike(){     
        setcolor('#cc9afa')
        const likegraphqlQuery = {
            query: `
                mutation {
                    likepost(id: "${post._id}", userid: "${userId}"){
                        likes
                    }
                }
            `
        }
        fetch('https://roast-people.herokuapp.com/graphql', 
        {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likegraphqlQuery)
        }
    )
    .then(res => res.json())
    .then(result => setlike(result.data.likepost.likes))
    .catch(err => console.log(err))
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
                <button id='like' onClick={handleLike}>
                    <FiThumbsUp color={color}></FiThumbsUp> | {like}
                </button>
                {creatorid === userId && <button id="delete-button" onClick={deletehandler}>delete</button>}
            </div>
        </div>
    )
}

export default Post