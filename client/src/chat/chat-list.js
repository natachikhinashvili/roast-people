import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import './messenger.css'
import image from '../arrow.png'
import {FiLoader} from "react-icons/fi";

function ChatList(){
    const [users, setUsers] = useState(null)
    const userId = localStorage.getItem('userid')
    useEffect(() => {
        fetch('https://roast-people.herokuapp.com/auth/chat-users', {method: 'GET'})
        .then((result) => result.json()
        ).then((users) => {
            setUsers(users.users)
        })
        .catch(err => console.log(err))
    }, [])
    return (
        <div id="list">
            <button id='goback-profile'>
                <Link to='/'> 
                    <img id='goback'alt='logo' src={image}/>
                </Link> 
            </button>
            <div id={users ? "users-list-div-container" : 'FiLoader-chatlist-container'} >
                {users ? users.map(user => {
                    return (
                        <div id='users-list-div'>
                        {user._id !== userId && (
                            <Link  style={{ textDecoration: 'none' }} key={user._id} to={'/chat/' + user._id + '-' + userId} >
                                <div id='chatlist-users-container'>
                                    <img src={user.pic} className='pic' alt='profile'/>
                                    <h1 id="chatlist-username" key={user._id}> { user.name } </h1>
                                </div>
                            </Link>
                        )}
                        </div>
                    ) 
                    }): <div><FiLoader color="#ffff"/></div> }
            </div>
        </div>
    )
}

export default ChatList