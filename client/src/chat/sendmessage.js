import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiNavigation, FiLoader } from "react-icons/fi";
import {gql, useQuery} from '@apollo/client'

import image from '../arrow.png'
import './messenger.css';

export default function SendMessage(){
    const token = localStorage.getItem('token')
    const myid = localStorage.getItem('userid')
    const [edit, setedit] = useState({ messages: false , name : ''})
    const [otheruserstate, setotheruser] = useState(false)
    const navigate = useNavigate()
    const messageref = useRef()
    const slug = useParams()


    const LOAD_MESSAGES = gql`
    query {
      messages(id: "${slug.id.split('-')[1]}") {
        _id 
        text
        place
      }
    }
    `
    function handleSubmit(e){
        e.preventDefault()
    }

    const  {error, loading, data} = useQuery(LOAD_MESSAGES)
    function send(e){
        e.preventDefault();  
    }

    useEffect(() => {
      console.log(data, error,loading)
    },[data, error, loading])
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
              <form id='form-msg'onSubmit={handleSubmit}>
                  <input id='message-input' type="text" ref={messageref}/>
                  <button id='send-btn' onClick={send}><FiNavigation color='#9f6cff' id='icon'/></button>
              </form>
              </div>
            </div>
        </div>
    )
}