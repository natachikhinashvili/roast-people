import React from "react";
import { useNavigate } from "react-router";
import './settings.css'
import { Link } from "react-router-dom";
import image from '../arrow.png'
export default function Settings(){
    const navigate = useNavigate();
    function logout(){
        localStorage.clear()
        navigate('/');
    }
    return (
        <div id='settings-container'>
        <button id='goback-profile'>
<Link to='/'>
            <img id='goback'alt='logo' src={image}/>
       
    </Link> </button>
            <button id='log-out-btn' onClick={logout}>
                log out
            </button>
        </div>
    )
}