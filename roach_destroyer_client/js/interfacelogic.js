let socket;
let pressed = false
const litKeyImageMap = {'ArrowUp':'litup.png','ArrowDown':'litdown.png','ArrowLeft':'litleft.png','ArrowRight':'litright.png'}
const serverAddress = "ws://192.168.1.6:8765"

document.getElementById("connectButton").addEventListener('click',() => createConnection(serverAddress))
document.addEventListener('keydown',(event) => sendDirection(event))
document.addEventListener('keyup',(event) => stop(event))
document.getElementById("speedRange").addEventListener('input',(event) => displaySpeed(event))




function createConnection(server) {
    socket = new WebSocket(server)
    socket.onopen = function (event) {
        document.getElementById('connectedText').innerHTML = "Succesfully connected to server at " + server; 
        socket.onmessage = (event) => handleServerMessages(event.data)
    };
}

function handleServerMessages(data) {
    document.getElementById('stream').src = "data:image/;base64," + data

}



function lightUpArrowDisplay(key) {
    document.getElementById(event.key).src = 'assets/' + litKeyImageMap[key]

}

function sendDirection(event) { 
    if (event.key in litKeyImageMap && !pressed) {
            socket.send(event.key)
            pressed = true
            lightUpArrowDisplay(event.key)
            
    }
}

function stop(event) {
    socket.send('stop')
    document.getElementById(event.key).src = 'assets/' + 'un' + litKeyImageMap[event.key]
    pressed = false
}

function displaySpeed() {s
    let speedText = document.getElementById("speedText")
    speedText.innerHTML = event.target.value + '%'
}