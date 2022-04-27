import React, { useRef,useState } from 'react'
import './login.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {gql, useQuery} from '@apollo/client'

export default function Login(){
    const navigate = useNavigate();
    const emailref = useRef()
    const passref = useRef();
    const [state, setState] = useState({email : '', password: ''})
    const graphqlQuery = gql`
        query {
            login(email: "${state.email}", password: "${state.password}")
            {
                token
                userId
            }
        }
    ` 
const {error,  loading, data} = useQuery(graphqlQuery)
    async function handleSubmit(formval){        
        if(error){
            console.log(error)
            //navigate('/error-page')
        }
        formval.preventDefault()
        if(data){
        localStorage.setItem('userid',data.login.userId)
        localStorage.setItem('token',data.login.token)
        }
        if(!loading && data){
            navigate('/feed')
        }
    }
    function handleChange(){
        setState({email : emailref.current.value,password : passref.current.value})
    }
    
    return(
        <div id='login-container'>
            <h1 id='login-h1'>Log In</h1>
            <form id='login-form' onSubmit={handleSubmit}>
                <label className='login-labels'>Enter your Email</label>
                <input id='login-enter-username'onChange={handleChange} ref={emailref} placeholder='email'/>
                <label id='password-label' className='login-labels'>Enter your password</label>
                <input id='login-enter-password' type='password' onChange={handleChange} ref={passref} placeholder='password'/>
                <button id='submit-login' type='submit'>Log in</button>
            </form>                    
            <Link to='/create-account'>
                <button id='navigate-to-createacc'>create account</button>
            </Link>
        </div>
    )
}