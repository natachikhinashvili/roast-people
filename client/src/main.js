import { useSelector } from 'react-redux';
import Feed from './feed/feed';
import Login from './login/login';

export default function Main(){
    const token = localStorage.getItem('token')
    return token ? <Feed/> : <Login/>
}