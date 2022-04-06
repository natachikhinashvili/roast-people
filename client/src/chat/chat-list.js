import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import './messenger.css'
import {gql, useQuery} from '@apollo/client'
import {FiLoader} from "react-icons/fi";
import GoBack from '../gobackfolder/goback'
function ChatList(){
    const [users, setUsers] = useState(null)
    const userId = localStorage.getItem('userid')   
    const loadusers = gql`
        query {
            users{
                _id
                name
                pic
            } 
            messages(id: "${userId}") {
                place
            }
        }
    `
    const {error, loading, data} = useQuery(loadusers)
    useEffect(() => {
        if(data){
            let filteredusers = []
            let messplace;
            data.users.map(user => {
                data.messages.map(mess => {
                    messplace = mess.place.split('-')[0]
                })
                if(messplace === user._id && user._id !== userId){
                    filteredusers.push(user)
                }
            })
            setUsers(filteredusers)
        }
    }, [data,error, userId])
    return (
        <div id="list">
            <GoBack/>
            <div id={users ? "users-list-div-container" : 'FiLoader-chatlist-container'} >
                {users ? users.map(user => {
                    return (
                        <div id='users-list-div'>
                            <Link  style={{ textDecoration: 'none' }} key={user._id} to={'/chat/' + user._id + '-' + userId} >
                                <div id='chatlist-users-container'>
                                    <img src={user.pic} className='pic' alt='profile'/>
                                    <h1 id="chatlist-username" key={user._id}> { user.name } </h1>
                                </div>
                            </Link>
                        </div>
                    ) 
                    }): <div><FiLoader color="#ffff"/></div> }
                    {users && users.length === 0 && (
                        <div id="no-connections-found">
                            <h1 id="nofound-h1">No connections found</h1>
                            <Link to={'/search'} style={{ textDecoration: 'none', color:'white' }}>
                                <button id="nofound-find">
                                    find people
                                </button>
                            </Link>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default ChatList