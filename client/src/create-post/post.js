import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './post.css'
import { FiThumbsUp } from 'react-icons/fi'
const Post = ({ post }) => {
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
        fetch('http://localhost:8080/graphql', 
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
    }, [])
    const graphqlQuery = {
        query: `
            mutation {
                deletePost(id: "${post._id}")
            }
        `
    }
    function deletehandler(){
        fetch('http://localhost:8080/graphql', 
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
        fetch('http://localhost:8080/graphql', 
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
.then(result => {
    setlike(result.data.likepost.likes)
})
    .catch(err => console.log(err))
    }
    return (
        <div id = 'post'>
                    <div id='post-settings'>
                        <div id='profilepic-info'>
                            <img alt='profile' src={post.creator.pic} id='profile-pic'/>
                            <div id='feed-post-creator-createdAt'>
                                <h3>{post.creator.name}</h3>
                                <h4 id="post-createdAt">{ post.createdAt.toString().slice(0,21) }</h4>
                            </div>
                        </div>
                        <button id="delete-button" onClick={deletehandler}>delete</button>
                    </div>
                    <h1 id="post-title">{post.title}</h1>
                    <div id='pic-container'>
                        {post.imageUrl !== '' && <img src={post.imageUrl} id='post-pic' alt='post'/>}
                    </div>
                    <div>
                        <button id='like' onClick={handleLike}>
                            <FiThumbsUp color={color}></FiThumbsUp> | {like}
                        </button>
                    </div>
        </div>
    )
}

export default Post