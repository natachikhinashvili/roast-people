import React, { useRef } from "react"
import './searchusers.css'
import {gql, useQuery} from '@apollo/client'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiLoader, FiSearch } from "react-icons/fi"
import image from './arrow.png'
function SearchUsersList(){
    const [users,setusers] = useState(false)
    const userid = localStorage.getItem('userid')
    const searchref = useRef()
    const [val, setval] = useState('nat')
    const loadusers = gql`
        query {
            users{
                _id
                name
                pic
            } 
        }
    `
    const {error, loading, data} = useQuery(loadusers)
    let searchloadusers = gql`
        query {
            searchusers(name: "nat"){
              _id
              name
              pic
            } 
        }
    `;
    const {searcherror, searchloading, searchdata} = useQuery(searchloadusers)
    console.log(searcherror, searchloading, searchdata)
    useEffect(() => {
        if(data){
            let filtered = data.users.filter(user => userid !== user._id)
            setusers(filtered)
        }
    }, [data,error, userid])
    function handleSubmit(e){
        e.preventDefault()
        // send query that searchs with targeted value 
        setval(searchref.current.value)
        console.log(searchref.current.value)
    }
    function handlechange(){
        setval(searchref.current.value)
        console.log(searchref.current.value)
    }
    return (
        <div id="SearchUsersList">
            <header id="SearchUsersList-header">
        <button id='goback-from-chat'>
          <Link to='/'>
            <img id='goback'alt='logo' src={image}/> 
          </Link> 
        </button>
            <form id="SearchUsersList-form" onSubmit={handleSubmit}>
                <input ref={searchref} id="search" onChange={handlechange}/>
                <button type="submit" id='SearchUsersList-search-btn'>
                    <FiSearch color='#9f6cff'/>
                </button>
            </form></header>
            <div id='search-users-container'>
                {loading && <FiLoader color="#fff"/>}
                {users && users.map(user => {
                    return (
                        <Link style={{ textDecoration: 'none' }} id='searchusers-user' to={'/profile/' + user._id}>
                            <img src={user.pic} alt='profile' id='searchusers-profile'/>
                            <h1>{user.name}</h1>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchUsersList;