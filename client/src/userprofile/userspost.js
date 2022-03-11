import React,{useState, useEffect} from 'react';
import './profile.css'
import { useNavigate } from 'react-router-dom';
import { FiThumbsUp } from 'react-icons/fi'
const UsersPost = ({ post }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
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
            console.log(result)
            setlike(result.data.post.likes)
        })
        .catch(err => console.log(err))
    }, [post._id,token])
    const graphqlQuery = {
        query: `
            mutation {
                deletePost(id: "${post._id}")
            }
        `
    }
    function deletehandler(){
        fetch('https://roast-people.herokuapp.com/graphql',{
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
.then(result => {
    setlike(result.data.likepost.likes)
})
    .catch(err => console.log(err))
    }
    return (
        <div id='userpost-background'>
        <div id = 'userpost'>
                <div id='userpost__header'>
                    <h1 id="post-title">{post.title}</h1>
                    <button id="delete-button" onClick={deletehandler}>delete</button>
                </div>
                    {post.imageUrl !== '' && <img src={post.imageUrl} alt="" id='profile-post-pic'/>}
                    <div>
                        <button id='like' onClick={handleLike}>
                            <FiThumbsUp color={color}></FiThumbsUp> | {like}
                        </button>
                    </div>
        </div></div>
    )
}

export default UsersPost