import './create-acc.css'
import React, {useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {gql, useMutation} from '@apollo/client'
import { Link } from 'react-router-dom'
export default function CreateAcc(){
    const navigate = useNavigate()
    const emailreference = useRef()
    const reference = useRef()
    const passwordreference = useRef()
    const ageref = useRef()
    const [state, setState] = useState({imagesrc: '',password: '', name: '', email: '', age: 0})
    function onFileLoad(e) {
        //Get current selected or dropped file (it gives you the ability to load multiple images).
        if( e.currentTarget.files[0]) {
        const file = e.currentTarget.files[0];
        //Create instance 
        let fileReader = new FileReader();
        //Register event listeners
        fileReader.onload = () => {
         let image = new Image();
         image.src = fileReader.result
         image.className = 'post-image'
         document.getElementById('files-here').append(image)
        }
        //Read the file as a Data URL (which gonna give you a base64 encoded image data)
        fileReader.readAsDataURL(file);
    
        console.log(e.currentTarget.files[0])
      }
      }
    let graphqlQuery = gql`
        mutation CreateUser{
            createUser(userInput: {email: "${state.email}",
            name: "${state.name}",
            password: "${state.password}",
            pic: "${state.imagesrc}"
            })
            {
                _id
                email
            }
        }
    `

    const [createAccount] = useMutation(graphqlQuery)
    async function handleSubmit(formval){
        formval.preventDefault()
        await createAccount()
        navigate('/login')
    }
    function handleChange(){
        if(document.getElementById('files-here')){
            if(document.getElementById('files-here').childNodes.length > 0){
                setState({
                    imagesrc: document.getElementById('files-here').childNodes[0].src, 
                    password: passwordreference.current.value,
                    name: reference.current.value,
                    email: emailreference.current.value,
                    age: ageref.current.value
                })
            }
        }
    }
    return(
        <div id="create-acc-containter">
            <h1 id='c-a-a'>Create An Account</h1>
            <div id='create-acc-profile-pic-zone'>
                <h1>select profile picture</h1>      <div id='edit-area'>
                <div id="draggable-container">
                        <label className="custom-file-upload">
                          <input 
                            type="file"id="files"
                            name="file-browser-input"
                            onDragOver={(e) => {
                            e.preventDefault();
                               e.stopPropagation();
                            }}
                            onDrop={onFileLoad}
                            onChange={onFileLoad}/>
                        </label>
                    </div>
                </div>
                <div id='files-here'></div>
            </div>
            <form  id='create-acc-form' noValidate onSubmit={handleSubmit}>
                <label className="create-acc-label" >Full Name</label>
                <input id='create-acc-name-input' name="name" ref={reference} onChange={handleChange}/>
                <label className="create-acc-label" >Email</label>
                <input id='create-acc-email-input' name='email' ref={emailreference} onChange={handleChange}/>
                <label className="create-acc-label" >password</label>
                <input id='create-acc-password-input' name='password' ref={passwordreference} onChange={handleChange}/>
                <label className="create-acc-label" >age</label>
                <input id='create-acc-age-input' name='age' type='number' ref={ageref} onChange={handleChange}/>
                <button id='create-btn' type='submit'>create</button>  
                <Link to='/login'>
                    <button id='login-increateacc-btn'>login</button> 
                </Link>
            </form>
        </div>
    )
}