import React, { useEffect } from "react";
import { useRef } from "react";
import './messenger.css';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FiNavigation, FiLoader } from "react-icons/fi";
import image from '../arrow.png'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
export default function SendMessage(){
    const token = localStorage.getItem('token')
    const myid = localStorage.getItem('userid')
    const [edit, setedit] = useState({ messages: false , name : ''})
    const [otheruserstate, setotheruser] = useState(false)
    const [isMine, setismine] = useState()
    const navigate = useNavigate()
    const messageref = useRef()
    const slug = useParams()
    function handleSubmit(e){
        e.preventDefault()
    }
    /**
     * createRoom(){
     *    return id1 + - + id2
     * }
     * if(user1id === id1 && user2id === id2)
     * ro gagzavni mesijs qondes rumis addressi da tu im adress emtxveva rac linkshia mashin achvenos.
     */
    function send(e){
        e.preventDefault();  
        let graphqlQuery = {
            query: `
              mutation {
                createMessage(messageInput: {text: "${messageref.current.value}", place: "${slug.id}"}){
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
        }
        fetch('http://roast-people.herokuapp.com/graphql',{
          method: "POST",
          body: JSON.stringify(graphqlQuery),
          headers: {
            Authorization:token,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then((resData) => {
          setedit({ messages: [...edit.messages] , name: resData.data.createMessage.creator.name}) 
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
      const qraphqlQuery = {
        query: `{
            messages(id: "${slug.id.split('-')[1]}") {
              _id 
              text
              creator {
                _id
                name
                pic
              }
              place
            }
        }`
      }
      fetch('https://roast-people.herokuapp.com/graphql',
      { 
        method: "POST",
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(qraphqlQuery)
      }
      )
      .then(res => res.json())
      .then(resData => {
        if(resData.errors){
          navigate('/error-page')
        }else{
        const filtered = resData.data.messages.filter(message => {
          return message.place === slug.id || message.place === slug.id.split('-').reverse().join('-')
        })
        setedit({ messages: filtered }) 
        const otheruser = edit.messages.filter((message) => {
         return message.creator._id !== myid
        })
        setotheruser(otheruser[0])
      }
      }) 
      .catch(err => console.log(err))
    },[token, edit.messages, myid, slug.id, navigate])
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
              {!edit.messages ? <FiLoader color="#ffff"/> : (
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