import React, { useRef } from 'react'
import './login.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { tokenActions } from '../token';

export default function Login(){

    const token = useSelector((state) => state.token.token);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const idref = useRef();

    function handleSubmit(formval){
        let email = formval.target[0].value;
        let password = formval.target[1].value;
        formval.preventDefault()
        const graphqlQuery = {
            query: `{ 
                login(
                    email: "${email}", 
                    password: "${password}")
                    {
                        token
                        userId
                    }
             }`
        }
        fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    graphqlQuery
                )
        })
        .then(res => res.json())
        .then(resData => {
            if(resData.errors && resData.errors[0].status === 422){
                throw new Error(
                    'Validation failed. email isnt used yet'
                )
            }
            console.log(resData)
            if(resData.errors){
                navigate('/error-page')
            }else{
           localStorage.setItem('userid',resData.data.login.userId)
           localStorage.setItem('token',resData.data.login.token)
            dispatch(tokenActions.reset(resData.data.login.token))
            navigate('/feed')
            }
        })
    }
    
    return(
        <div id='login-container'>
            <h1 id='login-h1'>Log In</h1>
            <form id='login-form' onSubmit={handleSubmit}>
                <label className='login-labels'>Enter your Email</label>
                <input id='login-enter-username' ref={idref} placeholder='email'/>
                <label id='password-label' className='login-labels'>Enter your password</label>
                <input id='login-enter-password' ref={idref} placeholder='password'/>
                    <button id='submit-login' type='submit'>Log in</button>
                    <Link to='/create-account'>
                        <button id='navigate-to-createacc'>create new account</button>
                    </Link>
            </form>
        </div>
    )
}