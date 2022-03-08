import './create-acc.css'
import React, {useState} from 'react'
//import { useNavigate } from 'react-router'
import useInput from './useformhook'
import { useNavigate } from 'react-router-dom';
import DropZone from '../create-post/dropzone'
import { Link } from 'react-router-dom'
export default function CreateAcc(){
    const navigate = useNavigate()
    const [clicked] = useState(false)
    const {
        validclass,
        hasError,
        reference,
        valueChangeHandler,
        inputBlurHandler 
    } = useInput(value => value.trim() !== '')

    const {
        validclass : emailvalidclass,
        hasError : emailhaserror,
        reference : emailreference,
        valueChangeHandler : emailChangeHandler ,
        inputBlurHandler : emailblurhandler 
    } = useInput(value => value.includes('@') && value.length >= 10 )

    const {
        validclass : passwordvalidclass,
        hasError : passwordhasError,
        reference : passwordreference,
        valueChangeHandler : passwordChangeHandler ,
        inputBlurHandler : passwordblurhandler 
    } = useInput(value => value.length >= 8 )

    const {
        validclass: agevalidclass, 
        hasError : agehaserror,
        reference : ageref,
        valueChangeHandler: ageChangeHandler,
        inputBlurHandler : ageblurhandler ,
    } = useInput(value => value >= 16 && value <= 100 )
    function handleSubmit(formval){
        let imagesrc ='';
    if(document.getElementById('files-here')){
      if( document.getElementById('files-here').childNodes.length > 0){
        imagesrc = document.getElementById('files-here').childNodes[0].src
      }
    }
        formval.preventDefault()
        let graphqlQuery = {
            query: `
                mutation {
                  createUser(userInput: {email: "${formval.target[1].value}",
                   name: "${formval.target[0].value}",
                password: "${formval.target[2].value}",
pic: "${imagesrc}"
            }){
                    _id
                    email
                  }
                }
              `
            }

       fetch('https://roast-people.herokuapp.com/graphql',{ 
           method: 'POST', 
           headers: {
           'Content-Type': 'application/json'
           },
           body: JSON.stringify(graphqlQuery)
       })
       .then(res => res.json())
       .then(resData => {
           if(resData.errors && resData.errors[0].status === 422){
               throw new Error(
                   'Validation failed. email is already in use'
               )
           }
           
           console.log(resData)
           
      if(resData.errors){
        navigate('/error-page')
      }
       })
    }
    return(
        <div id="create-acc-containter">
            <h1 id='c-a-a'>Create An Account</h1>
                <div id='create-acc-profile-pic-zone'>
                    <h1>select profile picture</h1>
                    <DropZone></DropZone>
                    <div id='files-here'></div>
                </div>
                <form  id='create-acc-form' noValidate onSubmit={handleSubmit}>
                    <label className="create-acc-label" >Full Name</label>
                    <input className={validclass} id='create-acc-name-input' name="name" onBlur = {inputBlurHandler} ref={reference} onChange={valueChangeHandler}/>
                    {hasError && (
                        <span>this field should not be empty</span>
                    )}
                    <label className="create-acc-label" >Email</label>
                    <input className={emailvalidclass} id='create-acc-email-input' name='email' onBlur = {emailblurhandler} ref={emailreference} onChange={emailChangeHandler}/>
                    {emailhaserror && (
                        <span>email should contain at least 10 characters</span>
                    )}
                    <label className="create-acc-label" >password</label>
                    <input className={passwordvalidclass} id='create-acc-password-input' name='password' onBlur = {passwordblurhandler} ref={passwordreference} onChange={passwordChangeHandler}/>
                    {passwordhasError && (
                        <span>password should contain at least 8 characters</span>
                    )}
                    <label className="create-acc-label" >age</label>
                    <input className={agevalidclass} id='create-acc-age-input' name='age' type='number' onBlur = {ageblurhandler} ref={ageref} onChange={ageChangeHandler}/>
                    {agehaserror && (
                        <span>You should be at least 16 years old to use this app</span>
                    )}
                    <button id='create-btn'>create</button>  
                    { clicked && hasError && emailhaserror && passwordhasError && agehaserror &&
                        <span className="form-warn">You must fill entire form to create account!</span>
                    } 
                    <Link to='/login'>
                        <button id='login-increateacc-btn'>login</button> 
                    </Link>
                </form>
        </div>
    )
}