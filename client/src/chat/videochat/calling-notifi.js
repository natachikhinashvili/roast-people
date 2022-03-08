import openSocket from 'socket.io-client';
import pc from './webrtc-connection';

const socket = openSocket('http://localhost:8080');

function Calling(){

    function answerhandler(){
        socket.emit('answer', { to: '', signalData: pc.signalingState })
    }
    return (
        <div id='call-notification'>
            <h1>is calling you!</h1>
            <button onClick={answerhandler}>answer</button>
        </div>
    )
}

export default Calling;