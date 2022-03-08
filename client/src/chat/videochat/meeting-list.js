import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import image from '../../arrow.png'
function MeetingList(){
    const navigate = useNavigate()
    const userid = localStorage.getItem('userid')
    function createroom(){
        navigate('/create-room/' + userid)
    }
    return (
        <div>
            <header id='meetingList-header'>
            <Link to='/'>
                <button id='goback-profile-to-home'>
                    <img id='goback'alt='logo' src={image}/>
                </button>
            </Link>
                <button id='create-room-btn' onClick={createroom}>
                    <svg id="add-icon" viewBox="0 0 24 24" width='20px' xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm4 13h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z"/></svg>
                </button>
            </header>
            <body  id='meetingList-body'>
            </body>
        </div>
    )
} 

export default MeetingList;