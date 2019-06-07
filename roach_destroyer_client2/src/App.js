import React from 'react';
import logo from './logo.svg';
import './App.css';
import litArrowUp from './assets/litup.png'
import litArrowDown from './assets/litdown.png'
import litArrowRight from './assets/litright.png'
import litArrowLeft from './assets/litleft.png'

import unlitArrowUp from './assets/unlitup.png'
import unlitArrowDown from './assets/unlitdown.png'
import unlitArrowRight from './assets/unlitright.png'
import unlitArrowLeft from './assets/unlitleft.png'

const arrowImages = {'litArrowUp':litArrowUp,'litArrowDown':litArrowDown,'litArrowRight':litArrowRight,'litArrowLeft':litArrowLeft,'unlitArrowUp':unlitArrowUp,'unlitArrowDown':unlitArrowDown,'unlitArrowRight':unlitArrowRight,'unlitArrowLeft':unlitArrowLeft}



function ControlPane(props) {
  return (
    <div id = "controlsPane">
        <h3> Movement Controls</h3>
        <div id = "arrowsPane">
            <div> <img id = 'ArrowUp' src={arrowImages[props.arrowUp]}/> </div>
            <div>
                <img id = 'ArrowLeft' src={arrowImages[props.arrowLeft]}/>
                <img id = 'ArrowRight' src={arrowImages[props.arrowRight]}/>
            </div>
            <div> <img id = 'ArrowDown' src={arrowImages[props.arrowDown]}/> </div>
        </div>
    </div>
  )
}

function Header(props) {
  return (
    <div id = "header">
        <h1> Roach Destroyer Client </h1>
    </div>
  )
}

function ConnectionPane(props) {
  let commandServerText = props.commandServerConnected? "command server connected": "command server not connected" 
  let streamServerText = props.streamServerConnected? "streaming server connected" : "streaming server not connected"
  return (
    <div id = "connectionPane">
        <button onClick = {props.createConnection} className ='btn nightowlButtons' id = "connectButton"> Connect! </button>
        <p id = "connectedText"> {commandServerText + ' and ' + streamServerText}</p>
    </div>
  )
}

class StreamPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed:false
    }
    this.prepareStreamBox = this.prepareStreamBox.bind(this);
  }

  prepareStreamBox() {
    this.setState({buttonPressed:true},this.props.startStream)
  }

  render() {
    let button = this.state.buttonPressed? "":<button id = "startStream" className="btn nightowlButtons" onClick = {this.prepareStreamBox}> Start Stream!</button> 
    let streamImage = this.state.buttonPressed? <img id='stream' style={{padding:'10px'}}/>:""
    return (
      <div id ="streamContainer">
          <div id = "streamBox"> 
            {button}
            {streamImage}
          </div>
      </div>
    )
    }
}

  

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamingServer:null,
      commandServer:null,
      streamingServerAddress:"ws://192.168.1.3:8764",
      commandServerAddress: "ws://192.168.1.3:8765",
      commandServerConnected:false,
      streamServerConnected:false,
      arrowPressed:false,
      arrows: {'ArrowUp':'unlitArrowUp','ArrowDown':'unlitArrowDown','ArrowRight':'unlitArrowRight','ArrowLeft':'unlitArrowLeft'}

    }
    this.createConnection = this.createConnection.bind(this);
    this.sendDirection = this.sendDirection.bind(this);
    this.stopMoving = this.stopMoving.bind(this);
    this.changeArrowDisplay = this.changeArrowDisplay.bind(this)
    this.startStream = this.startStream.bind(this);
  }

  createConnection() {
    let commandSocket = new WebSocket(this.state.commandServerAddress)
    commandSocket.onopen = () => (this.setState({commandServer:commandSocket,commandServerConnected:true}))
    
    let streamingSocket = new WebSocket(this.state.streamingServerAddress)
    streamingSocket.onopen = () => this.setState({streamingServer:streamingSocket,streamServerConnected:true})
    streamingSocket.onmessage = (event) => this.handleStreamMessages(event.data) 
  }

  sendDirection(event) {
    event.preventDefault();
    if (!this.state.arrowPressed & event.key in this.state.arrows) {
      this.state.commandServer.send(event.key)
      this.setState({arrowPressed:true})
      this.changeArrowDisplay(event.key,'on')
    }
  }

  stopMoving(event) {
    if (event.key in this.state.arrows) {
      this.state.commandServer.send("stop")
      this.setState({arrowPressed:false})
      this.changeArrowDisplay(event.key,'off')
    } 
  }

  changeArrowDisplay(arrowKey,mode) {
    let newSources = JSON.parse(JSON.stringify(this.state.arrows));
    mode === 'on'? newSources[arrowKey] = 'lit' + arrowKey:newSources[arrowKey] = 'unlit' + arrowKey
    this.setState({arrows:newSources})
  }

  handleStreamMessages(data) {
      document.getElementById('stream').src = "data:image/jpeg;base64," + data
}


  startStream() {
    this.state.streamingServer.send("start stream")
  }

  render() {
    console.log(this.state.commandServer)
    return (
      <div id ="mainPage" onKeyDown = {this.sendDirection} tabIndex="0" onKeyUp = {this.stopMoving}>
        <Header />
        <ConnectionPane 
          createConnection = {this.createConnection} 
          commandServerConnected = {this.state.commandServerConnected}
          streamServerConnected = {this.state.streamServerConnected}
        />
            
      <div id = "controlsAndVideoPane">
        <ControlPane 
        arrowUp = {this.state.arrows['ArrowUp']} 
        arrowDown = {this.state.arrows['ArrowDown']} 
        arrowLeft = {this.state.arrows['ArrowLeft']}
        arrowRight = {this.state.arrows['ArrowRight']} />
        <StreamPanel startStream = {this.startStream} />
      </div>
            
      <div id = "historyPaneContainer">
        <div id = "historyPane">
            <h3> History Controls </h3>
            <div id = "buttonsPane">
                <button id = "historyButton" className="btn nightowlButtons"> Turn history on</button>
                <button className="btn nightowlErrorButton"> Flush current set</button>
                <button className="btn nightowlPurpleButton"> New set</button>
            </div>
        </div>
      </div>
      
      <div id= "commandsPaneContainer">
        <div id = "commandsPane">
          <div>
              <h4> <i> Commands History</i></h4>
          </div>
        </div>
      </div>
  </div>
  
  
);
    }
  }
    
  

export default App;
