

class ClientInterface {
    constructor() {
        this.socket = null
        this.streamingSocket = null
        this.pressed = false
        this.streamBoxReady = false
        this.litKeyImageMap = {'ArrowUp':'litup.png','ArrowDown':'litdown.png','ArrowLeft':'litleft.png','ArrowRight':'litright.png'}
        this.serverAddress = "ws://192.168.1.3:8765"
        this.streamingAddress = "ws://192.168.1.3:8764"
        this.historyOn = false;

        this.addAllEventListeners() 
    }

    addAllEventListeners() {
        document.addEventListener('keydown',(event) => this.sendDirection(event))
        document.addEventListener('keyup',(event) => this.stop(event))
        document.getElementById("connectButton").addEventListener('click',() => this.createConnection(this.serverAddress))
        document.getElementById('historyButton').addEventListener('click',() => this.toggleHistory())
        document.getElementById('startStream').addEventListener('click',()=> this.startStreamButton())
    }

    createConnection(server) {
        this.socket = new WebSocket(server)
        this.socket.onopen = (event) => document.getElementById('connectedText').innerHTML = "Succesfully connected to server at " + server
        this.socket.onmessage = (event) => this.handleRobotMessages(event.data)

        this.streamingSocket = new WebSocket(this.streamingAddress)
        this.streamingSocket.onmessage = (event) => this.handleStreamMessages(event.data)

    }

    handleRobotMessages(data) {
        console.log(data)
    }

    handleStreamMessages(data) {
        if (!this.streamBoxReady) {
            this.streamBoxReady = true;
            this.clearStreamBox()
            document.getElementById('stream').src = "data:image/jpeg;base64," + data
        }
        else {
            document.getElementById('stream').src = "data:image/jpeg;base64," + data
    }
    }

    lightUpArrowDisplay(key) {
        document.getElementById(event.key).src = 'assets/' + this.litKeyImageMap[key]
    }

    sendDirection(event) {
        event.preventDefault()
        if (event.key in this.litKeyImageMap && !this.pressed) {

                this.socket.send(event.key)
                this.pressed = true
                this.lightUpArrowDisplay(event.key)      
        }
    }
    
    stop(event) {
        console.log("stop")
        event.preventDefault()
        this.socket.send('stop')
        document.getElementById(event.key).src = 'assets/' + 'un' + this.litKeyImageMap[event.key]
        this.pressed = false
    }

    startStreamButton() {
        this.streamingSocket.send("start stream")
        this.prepareStreamBox()
    }

    prepareStreamBox() {
        let streamBox = document.getElementById('streamBox');
        streamBox.removeChild(document.getElementById('startStream'))

        let placeholderText = document.createElement('p')
        placeholderText.id = "placeholderText"
        placeholderText.innerHTML = "Waiting for Camera to warm up..."
        streamBox.appendChild(placeholderText)

        let streamImage = document.createElement('img')
        streamImage.id = 'stream'
        streamImage.style = 'padding:10px'
        streamBox.appendChild(streamImage)
    }

    clearStreamBox() {
        let placeholderText = document.getElementById('placeholderText')
        placeholderText.parentNode.removeChild(placeholderText)
    }

    toggleHistory() {
        let historyButton = document.getElementById('historyButton')
        if (!this.historyOn) {
            this.historyOn = true
            historyButton.innerHTML = "turn history off"
            historyButton.className = 'btn nightowlErrorButton'
        }
        else {
            this.historyOn = false
            historyButton.innerHTML = "turn history on"
            historyButton.className = 'btn nightowlButtons'
        }
    }
}

new ClientInterface()















