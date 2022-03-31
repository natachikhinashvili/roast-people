import { useParams, Link } from "react-router-dom"
import {gql, useQuery, useMutation} from '@apollo/client'
import './comments.css'
import image from './arrow.png'
import { FiNavigation } from "react-icons/fi";
import Post from "./create-post/post"
import { useEffect, useRef, useState } from "react"

export default function Comments(){
    const slug = useParams()
    const commentref = useRef()
    const [state, setState] = useState(false)
    const myid = localStorage.getItem('userid')
    const [vars, setvars] = useState('')
    const post = gql`
            query {
                post(id: "${slug.id}"){
                    title
                    creator {
                        _id
                        name
                        pic
                    }
                    likes
                    createdAt
                    imageUrl
                }
                comments(id: "${slug.id}"){
                    text
                    creator {
                        _id
                        name
                        pic
                    }
                    createdAt
                }
            }
        `
        const {error, loading, data} = useQuery(post)
        const createComment = gql`
        mutation AddComment{
            addComment(text: "${vars}",place :"${slug.id}",id:"${myid}" ){
              text
          }
        }
        `
        const  [createcomment, {create_comment_data}] = useMutation(createComment)
        console.log(create_comment_data)
        console.log(data,loading,error)
        useEffect(() => {
            setState(data)
            console.log(data)
        },[data,loading,error])

        function handlechange(){
            setvars(commentref.current.value)
        }
        function handlesubmit(e){
            e.preventDefault()
            createcomment()
        }
    return (
        <div id='comments-page'>
        <button id='goback-from-chat'>
          <Link to='/'>
            <img id='goback'alt='logo' src={image}/> 
          </Link> 
        </button>
            {state && <Post creatorid={state.post.creator._id} user={state.post.creator.name} profile={state.post.creator.pic} post={state.post}/>}
            <section id='comments-section'>
                <div id="previous-comments">
                    {state && state.comments.map((comment) => {
                        return <div id="comment">
                                <img id="comment-creator-pic" alt="" src={comment.creator.pic}/>
                                <div>
                                    <p id="comment-createdat">{comment.createdAt.toString().slice(0,21)}</p>
                                    <p id="comment-text">{comment.text}</p>
                                </div>
                            </div>
                    })}
                </div>
                <form id='comment-form' onSubmit={handlesubmit}>
                    <input ref={commentref} onChange={handlechange} id='add-comment' placeholder="add comment"/>
                    <button type='submit' id='add-comment-btn'><FiNavigation color='#9f6cff' id='icon'/></button>
                </form>
            </section>
        </div>
    )
}