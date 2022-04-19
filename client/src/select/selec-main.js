import '../select/select.css'
import {gql, useQuery} from '@apollo/client'
import '../normalize.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {FiLoader} from "react-icons/fi";

import GoBack from '../gobackfolder/goback'

function Select(){
    const [users, setUsers] = useState([])
    const [num, setNum] = useState(0);
    const [swipe,setswiped] = useState(false)
    const userId = localStorage.getItem('userid')
    const loadusers = gql`
        query {
            users{
                _id
                name
                pic
            } 
        }
    `
    const {error, loading, data} = useQuery(loadusers)
    useEffect(() => {
        if(data){
            let filtered=data.users.filter(user => userId !== user._id)
            setUsers(filtered)
        }
    }, [data, error, userId, loading])
    function handleClick(event){
        setswiped(true)
    }
    function handleend(){
        if(num + 1 > users.length - 1){
            setNum(0);
        }else{
            setNum(prevState => prevState + 1);
        }
        setswiped(false)
    }
    let name;
    let _id;
    let img;
    if(users[num]){
        name = users[num].name;
        _id = users[num]._id;
        img = users[num].pic;
    }
    return (
        <div id='select-page'>
            <GoBack/>
            {!name ? <FiLoader color='#fff'/> : (
                <div onTouchMove={handleClick} onTouchEnd={handleend} onDragStart={handleClick} onDragEnd={handleend}>
                <div id='person-card' className={swipe ? 'translate' : ''}>
                    <div id='person-card-header'>
                      <Link to={'/profile/' + _id}>
                        <button id='person-card-viewprofile'>view profile</button>
                      </Link>
                    </div>
                    <body id='select-card-body'>
                        <h1 id='select-card-name'>{name && name}</h1>
                        <img id='select-card-img' alt='pictureofperson' src={img}/>
                    </body>
                    <div id='select-card-footer'>
                        <button id='select-card-nextbtn' onClick={handleClick}>next</button>
                        <Link to={'/chat/' + _id + '-' + userId}> <button id='select-card-roastbtn'>roast</button> </Link>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default Select