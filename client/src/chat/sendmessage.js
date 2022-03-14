import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiNavigation, FiLoader } from "react-icons/fi";
import {gql, useQuery, useMutation} from '@apollo/client'

import image from '../arrow.png'
import './messenger.css';

export default function SendMessage(){
    const token = localStorage.getItem('token')
    const myid = localStorage.getItem('userid')
    const [edit, setedit] = useState(false)
    const [otheruserstate, setotheruser] = useState(false)
    const [vars, setvars] = useState({messagevar: '', placevar: '', idvar: ''})
    const navigate = useNavigate()
    const messageref = useRef()
    const slug = useParams()

    let graphqlQuery = gql`
      mutation createMessage($text: String!,$place: String!,$id: ID!){
        createMessage(text: $text,place :$place,id:$id ){
          _id
          text
          creator {
            name
            _id
            pic
          }
        }
    }
    `
    const  [createmessage, {create_message_data}] = useMutation(graphqlQuery)
      console.log(create_message_data)

    useEffect(() => {
     // console.log(data, error,loading)
     // if(data){
     //   setedit( data.messages)
     // }
    },[])
    return (
        <div id='full-messages'>
          <header id='chat-header'>
            <button id='goback-from-chat'>
              <Link to='/'>
                <img id='goback'alt='logo' src={image}/> 
              </Link> 
            </button>
            {!otheruserstate ? <FiLoader color="#ffff"/> : <h1 id='chat-header-username' style={{color:"white"}}>{otheruserstate.creator.name}</h1>}
          </header>
          <div id='current-chat'>
            {!edit.messages ? <div id='messages-filoader'><FiLoader color="#ffff"/></div> : (
              <div id='messages-container'>
                {edit.messages.map(message => {
                  return (
                    <div id='message-body-container'>
                      <img alt='profile' className="pic" src={message.creator.pic}/>
                      <div id="message" className={message.creator._id !== slug.id.split('-')[0] ? 'mine' : 'elses'}>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  )
               })})
              </div>
            )}
            <div id='message-form'>
              <form id='form-msg' onSubmit={e => {      
                e.preventDefault()
                createmessage({variables: {
                  text: messageref.current.value,
                  place: slug.id,
                  id: slug.id.split('-')[1]
                }})
              }}>
                <input id='message-input' type="text" ref={messageref}/>
                <button id='send-btn' type='submit'><FiNavigation color='#9f6cff' id='icon'/></button>
              </form>
            </div>
          </div>
      </div>
    )
}