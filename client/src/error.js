import { useNavigate } from 'react-router-dom';
import './error.css'
import image from './Screenshot 2022-03-05 at 16.18.12.png'
function ErrorMessage(){
    const navigate = useNavigate()
    function handlegoback(){
        navigate('/login')
    }
    return (
        <div id='error-message-body'>
            <img id='error-page-img'alt='space' src={image}/>
            <h1 id='smthng-went-wrong'>something went wrong</h1>
            <button id='goback-from-error' onClick={handlegoback}>go back</button>
        </div>
    )
}

export default ErrorMessage;