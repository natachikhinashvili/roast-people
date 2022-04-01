import '../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Post from '../create-post/post';
import {FiLoader, FiSettings, FiSearch, FiEdit, FiUser, FiUsers, FiMail} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import {gql, useQuery} from '@apollo/client'

const LOAD_POSTS = gql`
    query {
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
export default function Feed(){
  const [state, setState] = useState([]);
    const {error, loading, data} = useQuery(LOAD_POSTS)
    const navigate = useNavigate()

    useEffect(() => {  
      if(data){
        setState(data.posts);
      }
      if(error){
        navigate('/error-page')
      }
    },[data, error, navigate])
    return  (
    <div className="App">
      <header className="App-header">
        <Link  style={{ textDecoration: 'none' }} to={"/profile"} >
          <button id='navigate-profile'>
            <FiUser color='#9f6cff'/>
          </button>
        </Link>
        <Link  style={{ textDecoration: 'none' }} to="/select" >
          <button id='navigate-select'>
            <FiUsers color='#9f6cff'/>
          </button>
        </Link>
        <Link to='/edit-post'>
          <button id='navigate-createpost'>
            <FiEdit color='#fff'/>  
          </button>
        </Link>
        <Link to={'/search'}>
          <button id='search-btn'>
            <FiSearch color='#9f6cff'/>
          </button>
        </Link>
        <Link to='/settings'>
          <button id='settings'> 
            <FiSettings  color='#9f6cff'/>
          </button>
        </Link>
      </header>
      {loading && <div id='loader-feed'><FiLoader/></div>}
      <div id='posts-container'>
          {state && state.map((post) => <Post key={post._id} creatorid={post.creator._id} user={post.creator.name} profile={post.creator.pic} post={post} />)}
      </div>
        <Link  style={{ textDecoration: 'none' }} to="/chat" >
          <button id='navigate-chat'>
            <FiMail color='#9f6cff'/>
            </button>
        </Link>
    </div>
  );
}  