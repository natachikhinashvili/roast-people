import { useParams } from "react-router-dom"
import {gql, useQuery, useMutation} from '@apollo/client'
import './comments.css'
import { FiNavigation, FiLoader } from "react-icons/fi";
import Post from "../create-post/post"
import { useEffect, useRef, useState } from "react"
import openSocket from 'socket.io-client'

import { v4 as uuidv4 } from 'uuid';

import GoBack from '../gobackfolder/goback'

export default function Comments(){
    const slug = useParams()
    const commentref = useRef()
    const [state, setState] = useState(false)
    const myid = localStorage.getItem('userid')
    const [vars, setvars] = useState('')
    const [socetcomments, setsocetcomments] = useState([])
    const [me, setme] = useState('')
    const socket = openSocket('https://roast-people.herokuapp.com/');
    const post = gql`
            query {
                post(id: "${slug.id}"){
                    _id
                    title
                    creator {
                        _id
                        name
                        pic
                    }
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
                user(id: "${myid}"){
                  pic
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
        const [createcomment] = useMutation(createComment)
        useEffect(() => {
            console.log(error,loading,data)
            setState(data)
            if(data){
                setme(data.user)
            }
            socket.once('comment', (params) => {
              const parsed = JSON.parse(params)
              setsocetcomments(socetmessages => [...socetmessages,{place:parsed.place,text: parsed.txt, pic: parsed.pic, _id: parsed.id,  messid: parsed.messid, createdAt: parsed.createdAt} ])
              return socket.disconnect()
            })
        },[data,loading,error, socetcomments])

        function handlechange(){
            setvars(commentref.current.value)
        }
        function handlesubmit(e){
            e.preventDefault()
            const params = {id:  myid, place: slug.id,txt: vars, pic: me.pic,messid:uuidv4(), createdAt: new Date()}
            socket.emit('comment' , JSON.stringify(params))
            createcomment()
            commentref.current.value = ''
        }
        const filtered = []
      
        for (var i = 0; i < socetcomments.length; i++) {
            if(i+1 !== socetcomments.length){
                if(socetcomments[i].messid!== socetcomments[i + 1].messid){
                    filtered.push(socetcomments[i])
                }
            }
            if(i+1 === socetcomments.length){
                filtered.push(socetcomments[i])
            }
        }
    return (
        <div id='comments-page'>
        <GoBack/>
            {state ? <><Post creatorid={state.post.creator._id} user={state.post.creator.name} profile={state.post.creator.pic} post={state.post}/>
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
                    
            {socetcomments!==[] && filtered.map(comment => {
                return (
                    comment.place === slug.id && <div id="comment">
                        <img id="comment-creator-pic" alt="" src={comment.pic}/>
                        <div>
                            <p id="comment-createdat">{comment.createdAt.toString().slice(0,21)}</p>
                            <p id="comment-text">{comment.text}</p>
                        </div>
                    </div>
                )
              })
            }
                </div>
                <form id='comment-form' onSubmit={handlesubmit}>
                    <input ref={commentref} onChange={handlechange} id='add-comment' placeholder="add comment"/>
                    <button type='submit' id='add-comment-btn'><FiNavigation color='#9f6cff' id='icon'/></button>
                </form>
            </section></>: <div id="load-comment"><FiLoader color="#fff"/></div>}
        </div>
    )
}