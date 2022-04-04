import image from '../arrow.png'
import { Link } from "react-router-dom";

import './goback.css'

export default function GoBack(){
    return (
        <button id='goback'>
            <Link to='/'>
                <img id='goback-icon'alt='logo' src={image}/> 
            </Link> 
        </button>
    )
}