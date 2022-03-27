import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FiNavigation, FiLoader } from "react-icons/fi";
import {gql, useQuery, useMutation} from '@apollo/client'
import openSocket from 'socket.io-client'
import image from '../arrow.png'
import './messenger.css';

export default function SendMessage(){
  const myid = localStorage.getItem('userid')
  const [otheruserstate, setotheruser] = useState(false)
  const [socetmessages, setsocetmessages] = useState([])
  const [edit, setedit] = useState([])
  const messageref = useRef()
  const [vars,setvars] = useState('')
  const [me,setme] = useState('')
  const slug = useParams()
  const socket = openSocket('https://roast-people.herokuapp.com/');
  const LOAD_MESSAGES = gql`
    query {
      user(id: "${slug.id.split('-')[1]}"){
        pic
      }
      otheruser(id: "${slug.id.split('-')[0]}"){
        _id
        pic
        name
      }
      messages(id: "${slug.id.split('-')[1]}") {
        _id 
        text
        place
        creator {
          name
          _id
          pic
        }
      }
    }
  `


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

  const  {error, loading, data} = useQuery(LOAD_MESSAGES)
  useEffect(() => {
    if(data){
      let filteredmess = data.messages.filter(message => message.place === slug.id || message.place === slug.id.split('-').reverse().join('-'))
      setedit({messages: filteredmess})
      setotheruser(data.otheruser)
      setme(data.user)
    }
    socket.once('message', (params) => {
      const parsed = JSON.parse(params)
      setsocetmessages(socetmessages => [...socetmessages,{text: parsed.txt, pic: parsed.pic, _id: parsed.id, place: slug.id} ])
      return socket.disconnect()
    })
  },[data,socetmessages])

  function handlesubmit(e){
    e.preventDefault()  
    const params = {id:  myid,txt: messageref.current.value, pic: me.pic}
    socket.emit('message' , JSON.stringify(params))
    createmessage()
  }
  const filtered = socetmessages.filter((message) => {
    const messindex = socetmessages[socetmessages.indexOf(message) + 1]
    if(messindex !== undefined) {
      return message._id !== messindex._id
    }
  })
  console.log(filtered)
  function handlechange(){
    setvars(messageref.current.value)
  }
  console.log(socetmessages)
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
          <div id='messages-container'>
            {!edit.messages ? <div id='messages-filoader'><FiLoader color="#ffff"/></div> : (
              edit.messages.map(message => {
                return (
                  <div id='message-body-container'>
                    <img alt="profile" id="chat-profile-pic" src={message.creator.pic}/>
                    <div id="message" className={message.creator._id !== slug.id.split('-')[0] ? 'mine' : 'elses'}>
                      <p>{message.text}</p>
                    </div>
                  </div>
                )
              })
              
            )}
            {socetmessages!==[] && filtered.map(message => {
                return (
                  message.place === slug.id && <div id='message-body-container' key={message._id}>                    
                  <img alt="profile" id="chat-profile-pic" src={message.pic}/>
                    <div id="message" align="left" className={message._id !== slug.id.split('-')[0] ? 'mine' : 'elses'}>
                      <p>{message.text}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div id='message-form'>
            <form id='form-msg' onSubmit={handlesubmit}>
              <input onChange={handlechange} id='message-input' type="text" ref={messageref}/>
              <button id='send-btn' type='submit'><FiNavigation color='#9f6cff' id='icon'/></button>
            </form>
          </div>
        </div>
    </div>
  )
}