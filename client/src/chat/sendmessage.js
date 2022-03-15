import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiNavigation, FiLoader } from "react-icons/fi";
import {gql, useQuery, useMutation} from '@apollo/client'

import image from '../arrow.png'
import './messenger.css';

export default function SendMessage(){
    const myid = localStorage.getItem('userid')
    const [edit, setedit] = useState(false)
    const [otheruserstate, setotheruser] = useState(false)
    const [vars, setvars] = useState('')
    const navigate = useNavigate()
    const messageref = useRef()
    const slug = useParams()


    const LOAD_MESSAGES = gql`
      query {
        messages(id: "${slug.id.split('-')[1]}") {
          _id 
          text
          place
          creator {
            name
            pic
          }
        }
        otheruser(id: "${slug.id.split('-')[0]}"){
          pic
          name
        }
      }
    `
    const  {error, loading, data} = useQuery(LOAD_MESSAGES)

    let graphqlQuery = gql`
      mutation CreateMessage{
        createMessage(text: "${vars}",place :"${slug.id}",id:"${myid}" ){
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

    useEffect(() => {
      console.log(data, error,loading)
      if(data){
        setedit({messages: data.messages})
        console.log(data.otheruser)
        setotheruser(data.otheruser)
      }
    },[data, error,loading])
    function handlesubmit(e){
      e.preventDefault()
      console.log(data)
      createmessage()
    }
    function handlechange(){
      setvars(messageref.current.value)
    }
    return (
        <div id='full-messages'>
          <header id='chat-header'>
            <button id='goback-from-chat'>
              <Link to='/'>
                <img id='goback'alt='logo' src={image}/> 
              </Link> 
            </button>
            {!otheruserstate ? <FiLoader color="#ffff"/> : <div id='chat-otheruser-topbar'><img alt='profile' id='chat-otheruser-topbar-profilepic' src={otheruserstate.pic}/><h1 id='chat-header-username' style={{color:"white"}}>{otheruserstate.name}</h1></div>}
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
              <form id='form-msg' onSubmit={handlesubmit}>
                <input id='message-input' onChange={handlechange} type="text" ref={messageref}/>
                <button id='send-btn' type='submit'><FiNavigation color='#9f6cff' id='icon'/></button>
              </form>
            </div>
          </div>
      </div>
    )
}