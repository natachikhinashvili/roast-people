import '../select/select.css'
import '../normalize.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import image from '../arrow.png'
import {FiLoader} from "react-icons/fi";
function Select(){
    const [users, setUsers] = useState([])
    const [num, setNum] = useState(0);
    const userId = localStorage.getItem('userid')
useEffect(() => {
    fetch('https://roast-people.herokuapp.com/auth/chat-users', {method: 'GET'})
    .then((result) => result.json()
    ).then((users) => {
        const filteredusers = users.users.filter((user) => {
            return user._id !== userId
        })
       setUsers(filteredusers)
    })
    .catch(err => console.log(err))
},[])
    function handleClick(){
        if(users.length > 1){
        if(num + 1 > users.length - 1){
            setNum(prevState => prevState - 1);
        }else{
            setNum(prevState => prevState + 1);
        }
    }
    }
    let name;
    let _id;
    let img;
    if(users[num]){
     name = users[num].name;
     _id = users[num]._id;
     img=users[num].pic
    }
    return (
        <div id='select-page'>
        <Link to='/'>
            <button id='goback-otherprofile-to-home'>
                <img id='goback'alt='logo' src={image}/>
            </button>
        </Link>
        {!name ? <FiLoader color='#fff'/> : (
           <div id='person-card'>
            <div id='person-card-header'>
              <Link to={'/profile/' + _id}>
              <button id='person-card-viewprofile'>view profile</button>
              </Link>
                
            </div>
<h1 id='select-card-name'>{name && name}</h1>
<img id='select-card-img' alt='pictureofperson' src={img}/>
                <div id='select-card-footer'>
                    <button id='select-card-nextbtn' onClick={handleClick}>next</button>
                   <Link to={'/chat/' + _id + '-' + userId}> <button id='select-card-roastbtn'>roast</button> </Link>
                </div>

            </div>
            )}
        </div>
    )
}

export default Select