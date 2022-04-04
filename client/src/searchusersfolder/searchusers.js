import React, { useRef } from "react"
import './searchusers.css'
import {gql, useQuery} from '@apollo/client'
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiLoader } from "react-icons/fi"
import GoBack from '../gobackfolder/goback'
function SearchUsersList(){
    const [users,setusers] = useState(false)
    const userid = localStorage.getItem('userid')
    const searchref = useRef()
    const [val, setval] = useState('')
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
    useEffect(() => {
        if(data)
        {
            let filtered = data.users.filter(user => userid !== user._id)
            if(val !== ''){
                filtered = filtered.filter(user => val.toLowerCase().trim() === user.name.toLowerCase().slice(0, val.length))
            }
            setusers(filtered)
        }
    }, [data,error, userid,val])
    function handlechange(){
        setval(searchref.current.value)
    }
    return (
        <div id="SearchUsersList">
            <header id="SearchUsersList-header">
                <GoBack/>
                <form id="SearchUsersList-form">
                    <input ref={searchref} placeholder='search...' id="search" onChange={handlechange}/>
                </form>
            </header>
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