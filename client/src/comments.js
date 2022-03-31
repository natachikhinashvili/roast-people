import { useParams, Link } from "react-router-dom"
import {gql, useQuery} from '@apollo/client'
import './comments.css'
import image from './arrow.png'
import { FiNavigation } from "react-icons/fi";
import Post from "./create-post/post"
import { useEffect, useState } from "react"

export default function Comments(){
    const slug = useParams()
    const [state, setState] = useState(false)
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
            }
        `
        const {error, loading, data} = useQuery(post)
        console.log(data,loading,error)
        useEffect(() => {
            setState(data)
        },[data,loading,error])

    return (
        <div id='comments-page'>
        <button id='goback-from-chat'>
          <Link to='/'>
            <img id='goback'alt='logo' src={image}/> 
          </Link> 
        </button>
            {state && <Post creatorid={state.post.creator._id} user={state.post.creator.name} profile={state.post.creator.pic} post={state.post}/>}
            <section>
                <div id="previous-comments">

                </div>
                <form id='comment-form'>
                    <input id='add-comment' placeholder="add comment"/>
                    <button id='add-comment-btn'><FiNavigation color='#9f6cff' id='icon'/></button>
                </form>
            </section>
        </div>
    )
}