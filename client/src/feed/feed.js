import '../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Post from '../create-post/post';
import selecticon from '../search (1).png'
import profileIcon from '../profile-user.png'
import {FiLoader, FiSettings} from "react-icons/fi";
import { SiGotomeeting } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
export default function Feed(){
  const [state, setState] = useState([]);  
    
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
  /**
   *   const graphqlStatus = {
    query: `
      {
        user {
          status
        }
      }
    `
  }
   * fetch('http://localhost:8080/graphql',
    { 
      method: "POST",
      headers: {
        Authorization: 'Bearer', //bearer+token
        'Content-Type': 'application/json'
      },
      body: graphqlStatus
    })
    
    .then(res => res.json())
    .then(resData => {
      if(resData.errors){
        throw new Error('fetching status failed!');
      }
      setstate(...prevstate, status: resData.data.user.status)
    })
    .catch(err => console.log(err))
   */


    /**
     * updatestatus(){const graphqlStatus = {
    query: `
      {
        mutatioon {
          updateStatus( status:status){
            status
          }
        }
      }
    `
  }
     *  fetch('http://localhost:8080/graphql',
    { 
      method: "POST",
      headers: {
        Authorization: 'Bearer', //bearer+token
        'Content-Type': 'application/json'
      },
      body: graphqlStatus
    })
    
    .then(res => res.json())
    .then(resData => {
      if(resData.errors){
        throw new Error('fetching status failed!');
      }
      setstate(...prevstate, status: resData.data.user.status)
    })
    .catch(err => console.log(err))
     * }
     */


  useEffect(() => {  
    const qraphqlQuery = {
    query: `
      {
        posts {
            _id
            title
            imageUrl
            creator{
              _id
              name
              pic
            }
            createdAt
          }
      }
    `
  }
    fetch('http://localhost:8080/graphql',
    { 
      method: "POST",
      headers: {
        Authorization: token, //bearer+token
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
      setState(resData.data.posts);
      }
    })
    .catch(err => console.log(err))
  },[token])
    return  (
    <div className="App">
      <div id='header-postscontainer'>
            <header className="App-header">
            <Link to='/settings'>
                  <button id='settings'> 
                  <FiSettings  color='#9f6cff'/>
                  </button>
                </Link>
            <Link to='/meetings'>
                  <button id='settings'> 
                  <SiGotomeeting color='#9f6cff'/>
                  </button>
                </Link>
                <Link  style={{ textDecoration: 'none' }} to="/chat" >
                  <button id='navigate-chat'>
                    <svg xmlns="http://www.w3.org/2000/svg" id="chat" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M24,16v5a3,3,0,0,1-3,3H16a8,8,0,0,1-6.92-4,10.968,10.968,0,0,0,2.242-.248A5.988,5.988,0,0,0,16,22h5a1,1,0,0,0,1-1V16a5.988,5.988,0,0,0-2.252-4.678A10.968,10.968,0,0,0,20,9.08,8,8,0,0,1,24,16ZM17.977,9.651A9,9,0,0,0,8.349.023,9.418,9.418,0,0,0,0,9.294v5.04C0,16.866,1.507,18,3,18H8.7A9.419,9.419,0,0,0,17.977,9.651Zm-4.027-5.6a7.018,7.018,0,0,1,2.032,5.46A7.364,7.364,0,0,1,8.7,16H3c-.928,0-1-1.275-1-1.666V9.294A7.362,7.362,0,0,1,8.49,2.018Q8.739,2,8.988,2A7.012,7.012,0,0,1,13.95,4.051Z"/></svg>
                  </button>
                </Link>
            </header>
            {!document.getElementById('posts-container') && <div id='loader-feed'><FiLoader/></div>}
        <div id='posts-container'>
            {state && state.map((post) => <Post key={post._id} post={post} />)}
            </div>
       </div>
            <footer id='feed-footer'>
                <Link  style={{ textDecoration: 'none' }} to="/select" >
                  <button id='navigate-select'>
                   <img src={selecticon} alt='select' id='select-icon'/>
                  </button>
                </Link>
                  <Link to='/edit-post/false'>
                    <button id='navigate-createpost'>
                    <svg id="add-icon" viewBox="0 0 24 24" width='20px' xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm4 13h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z"/></svg>
                    </button>
                  </Link>

                <Link  style={{ textDecoration: 'none' }} to="/profile" >
                  <button id='navigate-profile'>
                   <img src={profileIcon} alt='profile' id='profile-icon'/>
                  </button>
                </Link>
            </footer>
        </div>
    );
}  