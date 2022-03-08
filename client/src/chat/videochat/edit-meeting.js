import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../messenger.css'
import image from '../../arrow.png'
import { useNavigate } from 'react-router-dom';
import openSocket from 'socket.io-client';
import { FiMic, FiMicOff, FiCamera, FiCameraOff, FiVideo } from 'react-icons/fi'
import pc from "./webrtc-connection";
import {FiLoader} from "react-icons/fi";

function EditRoom(){
    const [turned, setturned] = useState(false)
    const [user,setuser] = useState(false)
    const [second,setsecond] = useState(false)

    const slug = useParams()
    const navigate = useNavigate();

    const socket = openSocket('https://roast-people.herokuapp.com');

    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userid')


    useEffect(() => {


        let userquery = {
            query: `
                {
                    user {
                        name
                        pic
                        _id
                    }  
                }
            `
        }
        fetch('https://roast-people.herokuapp.com/graphql',{ 
            method: "POST",
            headers: {
              Authorization: token, //bearer+token
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userquery)
        })
        .then(res => res.json())
        .then(resData => {
            if(resData.errors){
                navigate('/error-page')
            }else{
            setuser(resData.data.user)
            }
        })
        fetch('https://roast-people.herokuapp.com/auth/chat-users', {method: 'GET'})
        .then((result) => result.json()
        ).then((users) => {
            setsecond(users.users)
        })
        .catch(err => console.log(err))
        socket.on('calling', (to) => {
            console.log(to)
        })
    }, [slug.id, socket, token, userId, navigate])
    //const clients = socket.io.adapter.rooms.get('621a592e0a6512330dab3989')
    //const numClients = clients ? clients.size : 0;
    //socket.to('Room Name').emit('new event', 'Updates');
//
    //for (const clientId of clients ) {
//
    ////this is the socket of each client in the room.
    //const clientSocket = socket.sockets.get(clientId);
//
    ////you can do whatever you need with this
    //clientSocket.leave('Other Room')
//
    //}
    async function handleuserinvite(calluserid){    
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        socket.emit('offer', { userToCall: calluserid, signalData: pc.signalingState, from: user.name });
        socket.emit('calling', {from: user.name, to: calluserid})
        return () => {
            socket.disconnect();
          }
    }

    async function handleturnon(){
        setturned(true)
        try {
            const constraints = {'video': true, 'audio': true};
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const videoElement = document.querySelector('video#localVideo');
            videoElement.srcObject = stream;
        } catch(error) {
            console.error('Error opening video camera.', error);
        }
    }

    return (
        <div id='edit-meeting-container'>

            <button id='goback-profile'>
                <Link to='/'>
                    <img id='goback'alt='logo' src={image}/>
                </Link> 
            </button>
            {!user ? <FiLoader color="#ffff"/> : (
               
            <div id='edit-meeting-container-condition'>
                <h1 id='user1name'>roaster 1 {user.name}</h1>

                {turned ? <video id='localVideo'  autoplay="autoplay" playsinline controls="false"></video> : <img id='myprofile-editroom-pic' alt='myprofile' src={user.pic}/> }
            
                <div id='edit-room-btns'>

                    <button className='edit-room-btns-btn' id='turn-camera-on' onClick={handleturnon}>
                        <FiCamera color='#9f6cff' className="icon"/>
                    </button>
                    <button className='edit-room-btns-btn' id='turn-mic-on'>
                        <FiMic color='#9f6cff'className="icon" />
                    </button>

                </div>
                <div id='edit-meeting-header-body'>
                    <div id='invite-other-users-header'>invite other users</div>
                    {!second ? <FiLoader color="#ffff"/> :

                        <div id='otherusers'>
                            { second.map( user => {
                                return (
                                    <div id='users-list-div'>
                                        {user._id !== userId && (
                                            <div id='username-invitebtn-roast'>
                                                <Link  style={{ textDecoration: 'none' }} key={user._id} to={'/chat/' + user._id + '-' + userId} >
                                                    <div id='pic-name'>
                                                        <img alt='profile' src={user.pic} id='profile-pic'/>
                                                        <h1 id="editmeeting-username" key={user._id}> { user.name } </h1>
                                                    </div>
                                                </Link>
                                                <button id='invite-friend-roast-btn' onClick={() => handleuserinvite(user._id)}><FiVideo color="#9f6cff"></FiVideo></button>
                                            </div>
                                        )}
                                    </div>
                                ) 
                            } ) }
                        </div> 

                }
                </div>

                <button id='start-roasting-btn'>start</button>
            </div> 
            )}
        </div>
    )
}

export default EditRoom;