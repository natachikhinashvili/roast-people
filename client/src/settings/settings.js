import React from "react";
import { useNavigate } from "react-router";
import './settings.css'

import {gql, useMutation} from '@apollo/client'
import GoBack from '../gobackfolder/goback'

export default function Settings(){
    const userId = localStorage.getItem('userid')
    const deleteaccquery = gql`
            mutation DeleteAccount{
                deleteAccount(userid: "${userId}")
            }
        `
        const [deleteAcc] = useMutation(deleteaccquery)
    const navigate = useNavigate();
    function logout(){
        localStorage.clear()
        navigate('/');
    }
    function deleteaccount(){
        deleteAcc()
    }
    return (
        <div id='settings-container'>
            <GoBack/>
            <button id='log-out-btn' onClick={logout}>
                log out
            </button>
            <button id='delete-account-btn' onClick={deleteaccount}>
                delete account
            </button>
        </div>
    )
}