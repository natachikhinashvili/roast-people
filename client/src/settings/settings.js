import React from "react";
import { useNavigate } from "react-router";
import './settings.css'

import GoBack from '../gobackfolder/goback'

export default function Settings(){
    const navigate = useNavigate();
    function logout(){
        localStorage.clear()
        navigate('/');
    }
    return (
        <div id='settings-container'>
            <GoBack/>
            <button id='log-out-btn' onClick={logout}>
                log out
            </button>
        </div>
    )
}