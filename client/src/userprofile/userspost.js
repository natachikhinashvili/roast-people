import React from 'react';
import './profile.css'
import { useNavigate } from 'react-router-dom';
const UsersPost = ({ post }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const graphqlQuery = {
        query: `
            mutation {
                deletePost(id: "${post._id}")
            }
        `
    }
    function deletehandler(){
        fetch('http://localhost:8080/graphql',{
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
            if(result.errors){
                navigate('/error-page')
            }
        })
        .catch(err => console.log(err))
    }
    console.log(post)
    return (
        <div id='userpost-background'>
        <div id = 'userpost'>
        <h4 id="post-createdAt">{  post.createdAt.toString().slice(0,21) }</h4>
                <div id='userpost__header'>
                    <h1 id="post-title">{post.title}</h1>
                    <button id="delete-button" onClick={deletehandler}>delete</button>
                </div>
                    {post.imageUrl !== '' && <img src={post.imageUrl} alt="" id='profile-post-pic'/>}
                <div id='post-actions'>
                </div>
        </div></div>
    )
}

export default UsersPost