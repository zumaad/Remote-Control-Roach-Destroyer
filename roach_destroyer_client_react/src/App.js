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

const arrowImages = { 'litArrowUp': litArrowUp, 'litArrowDown': litArrowDown, 'litArrowRight': litArrowRight, 'litArrowLeft': litArrowLeft, 'unlitArrowUp': unlitArrowUp, 'unlitArrowDown': unlitArrowDown, 'unlitArrowRight': unlitArrowRight, 'unlitArrowLeft': unlitArrowLeft }

function setUpCanvas(){

}

function ControlPanel(props) {
  return (
    <div id="controlsPane">
      <h3> Movement Controls</h3>
      <div id="arrowsPane">
        <div> <img id='ArrowUp' src={arrowImages[props.arrowUp]} /> </div>
        <div>
          <img id='ArrowLeft' src={arrowImages[props.arrowLeft]} />
          <img id='ArrowRight' src={arrowImages[props.arrowRight]} />
        </div>
        <div> <img id='ArrowDown' src={arrowImages[props.arrowDown]} /> </div>
      </div>
    </div>
  )
}

function Header(props) {
  return (
    <div id="header">
      <h1> Roach Destroyer Client </h1>
    </div>
  )
}

function ConnectionPanel(props) {
  let commandServerText = props.commandServerConnected ? <p className = "connectedText">command server connected</p> : <p className = "notConnectedText">command server not connected</p>
  let streamServerText = props.streamServerConnected ?  <p className = "connectedText">streaming server connected</p> : <p className = "notConnectedText">streaming server not connected</p>
  return (
    <div id="connectionPane">
      <button onClick={props.createConnection} className='btn nightowlButtons' id="connectButton"> Connect! </button>
      {commandServerText}
      {streamServerText}
    </div>
  )
}

class StreamPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: false
    }
    this.prepareStreamBox = this.prepareStreamBox.bind(this);
    this.endStreamHandler = this.endStreamHandler.bind(this);
  }

  prepareStreamBox() {
    this.setState({ buttonPressed: true }, this.props.startStream)
  }

  endStreamHandler() {
    this.props.endStream()
    this.setState({buttonPressed:false})
  }

  render() {
    let button = this.state.buttonPressed ? null : <button id="startStream" className="btn nightowlButtons" onClick={this.prepareStreamBox}> Start Stream!</button>
    let streamImage = this.state.buttonPressed ? <img id='stream' style={{ padding: '10px' }} /> : null;
    let stopStreamButton = this.state.buttonPressed? <button id = "stopStreamButton" className = 'nightowlErrorButton' onClick = {this.endStreamHandler}> X </button> : null

    return (
      <div id="streamContainer">
        {stopStreamButton}
        <div id="streamBox">
          {button}
          {streamImage}
        </div>
      </div>
    )
  }
}

class HistoryPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      commandSets: 
      {"set1":[],
      "set2":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "set3":[{command:'ArrowRight',time:166613},{command:'ArrowLeft',time:66641}],
      "set4":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}]},
      currentSet:null,
      lastTime:null,
      justCreated:null}
    this.scroller = React.createRef()
    
      
    this.pushSelected = this.pushSelected.bind(this);
    this.createCommandSets = this.createCommandSets.bind(this);
    this.gatherPairsOfCommands = this.gatherPairsOfCommands.bind(this);
    this.pushNewSet = this.pushNewSet.bind(this);
    this.deleteSet = this.deleteSet.bind(this);
    this.flushSet = this.flushSet.bind(this);
    this.playSet = this.playSet.bind(this);
    this.uploadSets = this.uploadSets.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.currentSet) {
      let recievedCommand,recievedTime;
      [recievedCommand,recievedTime] = nextProps.commandAndTime
      if (recievedTime != this.state.lastTime) {
        let copiedCommandSet = JSON.parse(JSON.stringify(this.state.commandSets))
        copiedCommandSet[this.state.currentSet].push({command:recievedCommand,time:recievedTime})
        this.setState({commandSets:copiedCommandSet,lastTime:recievedTime})
      }
      }
    if (this.state.commandSets === []) {
      let recievedCommandSets = JSON.parse(nextProps.recivedCommandSets)
      this.setState({recievedCommandSets:recievedCommandSets})
    }
    }

  playSet(mode) {
    if (this.state.currentSet && this.props.commandServerSocket.readyState === 1){
      let message = {
        type:mode,
        data: this.state.commandSets[this.state.currentSet]
      }
      this.props.commandServerSocket.send(JSON.stringify(message))
    }
  }

  deleteSet() {
    if (this.state.currentSet) {
      let copiedCommandSet = JSON.parse(JSON.stringify(this.state.commandSets))
      delete copiedCommandSet[this.state.currentSet]
      this.setState({commandSets:copiedCommandSet,currentSet:null})
    }
  }

  flushSet() {
    if (this.state.currentSet) {
      let copiedCommandSet = JSON.parse(JSON.stringify(this.state.commandSets))
      copiedCommandSet[this.state.currentSet] = []
      this.setState({commandSets:copiedCommandSet})
    }
  }
  
  pushSelected(setName) {
    this.state.currentSet? this.setState({currentSet:null}) : this.setState({currentSet:setName})
  }

  createCommandSets(commandSets) {
    let elementArray = []
    for (let name in commandSets){
      let possibleRef = this.state.justCreated === name? this.scroller : null
      console.log(possibleRef)
      elementArray.push(<CommandSet pref = {possibleRef} currentSet = {this.state.currentSet} pushSelectedFunc = {this.pushSelected} setName = {name}/>)
    }
    return elementArray
  }

  gatherPairsOfCommands(commandArr) {
    let elementArr = []
    let length = commandArr.length;
    for (let i= 0;i< length;i+=2) {
      if (!(i+1 >= length)) {
        elementArr.push(
        <p> 
          {commandArr[i].command} {commandArr[i].time} | {commandArr[i+1].command} {commandArr[i+1].time} | duration: {commandArr[i+1].time - commandArr[i].time} ms
        </p>)
      }
      else {
        elementArr.push(<p> {commandArr[i].command} {commandArr[i].time} </p>)
      }
    }
    return elementArr
  }

  pushNewSet(setName) {
    let copiedCommandSet = JSON.parse(JSON.stringify(this.state.commandSets))
    copiedCommandSet[setName] = []
    this.setState({commandSets:copiedCommandSet,justCreated:setName},() => this.scroller.current.scrollIntoView({behavior:'smooth'}))
  }

  uploadSets() {
    let message = {
      type:'upload',
      data:this.state.commandSets
    }
    this.props.commandServerSocket.send(JSON.stringify(message))
  }

  render() {
    return (
      <div>
        <HistoryControlsContainer 
        pushNewSet = {this.pushNewSet}
        deleteSet = {this.deleteSet}
        flushSet = {this.flushSet}
        playSet = {this.playSet}
        uploadSets = {this.uploadSets}/>

        <CommandsHistoryContainer 
        createCommandSetsFunc = {this.createCommandSets} 
        commandSets = {this.state.commandSets} 
        setName = {this.state.currentSet} 
        gatherPairsOfCommands = {this.gatherPairsOfCommands}
        setName = {this.state.currentSet}/>
        
      </div>
    )
  }
}

function CommandsHistoryContainer(props) {
  let specificSet = props.setName? 
  <ViewSelectedCommandSet setName = {props.setName} commandSets = {props.commandSets} gatherPairsOfCommands = {props.gatherPairsOfCommands}/>
  :
  <div style = {{textAlign:'center',margin:'2%',flexGrow:'1'}}>
    <i> <h4>You are not currently viewing any set</h4> </i>
  </div>
  return (
    <div id = "historyContainer">
      <CommandSetContainer 
      createCommandSetsFunc = {props.createCommandSetsFunc} 
      commandSets = {props.commandSets}
      pushNewSet = {props.pushNewSet}
      />
      {specificSet}
    </div>
  )
}

function CommandSetContainer(props){
  return (
    <div id = "commandSetLabelDiv">
      <h4> <i> Command Sets</i></h4>
      <div id = "commandSetContainer">
        {props.createCommandSetsFunc(props.commandSets)}
      </div>
    </div>
  )
}

function HistoryControlsContainer(props){
  return (
    <div id = "historyControlsContainer">
      <div id="historyControlsPanel">
        <h3> History Controls </h3>
        <div id="buttonsPane">
          <button onClick = {() => props.playSet("playback")} className = 'btn nightowlGreenButton spacedBtn'> Play</button>
          <button onClick = {() => props.playSet("reverse")} className = 'btn nightowlPurpleButton spacedBtn'> Reverse </button>
          <button onClick = {props.deleteSet} className = 'btn nightowlErrorButton spacedBtn'> Delete</button>
          <CreateSetButton pushNewSet = {props.pushNewSet}/>
          <button onClick = {props.flushSet} className="btn nightowlOrangeButton spacedBtn"> Flush</button>
          <button onClick = {props.uploadSets} className = 'btn nightowlBlueButton spacedBtn'> Upload</button>
        </div>
      </div>
    </div>
    
  )
}

function CommandSet(props) {
  let button = props.currentSet && props.currentSet ===props.setName? <button className = 'btn nightowlErrorButton' onClick = {()=>props.pushSelectedFunc(props.setName)}>  Deselect </button>
                :
                <button className = 'btn nightowlGreenButton' onClick = {()=>props.pushSelectedFunc(props.setName)}> Select</button>
    return (
      <div className = "commandSet" ref = {props.pref}>
        <p style = {{fontSize:'1.5em'}}> {props.setName} </p>
        {button}
      </div>
    )
}

function ViewSelectedCommandSet(props) {
  return (
    <div id = "specificSetContainer">
      <h4> <i> Currently Viewing Set: {props.setName}</i></h4>
      <div id = "specificSet">
        {props.gatherPairsOfCommands(props.commandSets[props.setName])}
      </div>
    </div>
    
  )
}


class CreateSetButton extends React.Component {
  constructor(props){
    super(props) 
    this.state = {
      isPressed: false,
      trackingInput: ''
    }
    this.onclickHandler = this.onclickHandler.bind(this);
    this.trackInput = this.trackInput.bind(this);
    
  }

  onclickHandler() {
    if (this.state.isPressed) {
        if (this.state.trackingInput) {
          this.props.pushNewSet(this.state.trackingInput)
        }
        this.setState({isPressed:false,trackingInput:''})
    }
    else {
      this.setState({isPressed:true})
    }
    
  } 

  trackInput(event) {
    this.setState({trackingInput:event.target.value})
  }

  render() {
    let inputBar = this.state.isPressed? <input type = "text" value= {this.state.trackingInput} onChange = {this.trackInput} /> : null;
    return (
      <div style= {{display:'inline-block'}}>
      {inputBar}
      <button onClick= {this.onclickHandler} className="btn nightowlButtons spacedBtn"> Create</button>
      </div>
    )
  }
}

//made this a react componenet so i could hook it into existing interface code more easily
class SonicRadarDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.canvasHeight = 500
    this.canvasWidth = 500
    this.backgroundColor = '#272727'
    this.radius = 240
    this.centerX = this.canvasWidth/2
    this.centerY = this.canvasHeight/2
    this.green = '#00FF33'
    this.red = '#ff5874'
    
    this.initializeCanvasDisplay = this.initializeCanvasDisplay.bind(this);
    this.initializeCanvasCircles = this.initializeCanvasCircles.bind(this);
    this.initializeCanvasNavLines = this.initializeCanvasNavLines.bind(this);
    this.initializeCanvasText = this.initializeCanvasText.bind(this);
    this.drawRobotBox = this.drawRobotBox.bind(this);
  }

  initializeCanvasDisplay() {
    this.initializeCanvasCircles()
    this.initializeCanvasNavLines()
    this.drawRobotBox()
    this.initializeCanvasText()    
    
  }

  initializeCanvasCircles() {
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    canvasContext.lineWidth = 6;
    canvasContext.strokeStyle = this.green
    canvasContext.fillStyle = this.backgroundColor
    for (let i=10;i >-1;i--) {
      if (i === 10){
        canvasContext.beginPath();
        canvasContext.arc(this.centerX, this.centerY, this.radius/10 * i, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill()
        canvasContext.lineWidth = 1
      }
      else {
        canvasContext.beginPath()
        canvasContext.arc(this.centerX, this.centerY, this.radius/10 * i, 0, 2 * Math.PI);
        canvasContext.stroke()
      }
    }
  }

  initializeCanvasNavLines() {
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    canvasContext.strokeStyle = this.green
    
    let lineEndPoints = [[this.centerX,this.centerY + this.radius],[this.centerX,this.centerY - this.radius],
                          [this.centerX + this.radius, this.centerY],[this.centerX - this.radius,this.centerY]]
    
    lineEndPoints.forEach((coordinates) => {
      canvasContext.beginPath()
      canvasContext.moveTo(this.centerX,this.centerY)
      canvasContext.lineTo(coordinates[0],coordinates[1])
      canvasContext.stroke()
    })
  }

  drawRobotBox() {
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    canvasContext.fillStyle = this.red
    canvasContext.beginPath()
    canvasContext.rect(this.centerX-10,this.centerY-6,20,30)
    canvasContext.fill()
  }

  initializeCanvasText() {
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    canvasContext.fillStyle = this.green
    canvasContext.font = "20px"
    for (let i=1;i<11;i++) {
      let distance = i * 10
      // +-3 or whatever offset is to make it sit above the axes or to the right,etc.
      canvasContext.fillText(distance.toString(),this.centerX + 3,this.centerY -(i * this.radius/10)+10)
      canvasContext.fillText(distance.toString(),this.centerX - (i * this.radius/10),this.centerY + 10)
      canvasContext.fillText(distance.toString(),this.centerX + (i * this.radius/10) - 16,this.centerY + 10)
    }
  }

  componentDidMount() {
    this.initializeCanvasDisplay()
  }

  render() {
    return (
    <div id = "sonarDisplayBox">
      <canvas id = "sonarCanvas" width = '500' height = '500' ></canvas>
    </div>)
  }
  
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasHeight = 500
    this.canvasWidth = 500
    this.backgroundColor = '#272727'
    this.radius = 240
    this.centerX = this.canvasWidth/2
    this.centerY = this.canvasHeight/2
    this.green = '#00FF33'
    this.red = '#ff5874'
    this.state = {
      streamingServer: null,
      commandServer: null,
      streamingServerAddress: "ws://172.20.10.7:8764",
      commandServerAddress: "ws://172.20.10.7:8765",
      commandServerConnected: false,
      streamServerConnected: false,
      arrowPressed: false,
      arrows: { 'ArrowUp': 'unlitArrowUp', 'ArrowDown': 'unlitArrowDown', 'ArrowRight': 'unlitArrowRight', 'ArrowLeft': 'unlitArrowLeft' },
      commandAndTime:[],
      recivedCommandSets:null,
      cleanSonar:null,
      streamStatus:false
    }
    

    this.createConnection = this.createConnection.bind(this);
    this.sendDirection = this.sendDirection.bind(this);
    this.stopMoving = this.stopMoving.bind(this);
    this.changeArrowDisplay = this.changeArrowDisplay.bind(this)
    this.startStream = this.startStream.bind(this);
    this.handleCommandServerMessages = this.handleCommandServerMessages.bind(this);
    this.handleStreamMessages = this.handleStreamMessages.bind(this)
    this.drawLine = this.drawLine.bind(this);
    this.endStream = this.endStream.bind(this);
    
  }

  componentDidMount() {
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    let cleanState = canvasContext.getImageData(0,0,canvas.width,canvas.height);
    this.setState({cleanSonar:cleanState})
  }

  createConnection() {
    
    let commandSocket = new WebSocket(this.state.commandServerAddress)
    commandSocket.onopen = () => (this.setState({ commandServer: commandSocket, commandServerConnected: true }))
    commandSocket.onmessage = (event) => this.handleCommandServerMessages(event.data)

    let streamingSocket = new WebSocket(this.state.streamingServerAddress)
    streamingSocket.onopen = () => this.setState({ streamingServer: streamingSocket, streamServerConnected: true })
    streamingSocket.onmessage = (event) => this.handleStreamMessages(event.data)
  }

  handleCommandServerMessages(data) {
    let decodedData = JSON.parse(data)
    this.drawLine(decodedData[0],decodedData[1])
    
  }


  sendDirection(event) {
    event.preventDefault();
    if (!this.state.arrowPressed & event.key in this.state.arrows) {
      let message = {
        type:"movement",
        data:event.key}
      this.state.commandServer.send(JSON.stringify(message))
      let keyAndTime = [event.key,new Date().getTime()]
      this.setState({ arrowPressed: true ,commandAndTime:keyAndTime})
      this.changeArrowDisplay(event.key, 'on')


    }
  }

  stopMoving(event) {
    if (event.key in this.state.arrows) {
      let message = {
        type:"movement",
        data:"stop"
      }
      this.state.commandServer.send(JSON.stringify(message))
      this.setState({ arrowPressed: false,commandAndTime:["stop",new Date().getTime()]})
      this.changeArrowDisplay(event.key, 'off')
    }
  }

  changeArrowDisplay(arrowKey, mode) {
    let newSources = JSON.parse(JSON.stringify(this.state.arrows));
    mode === 'on' ? newSources[arrowKey] = 'lit' + arrowKey : newSources[arrowKey] = 'unlit' + arrowKey
    this.setState({ arrows: newSources })
  }

  handleStreamMessages(data) {
    if (this.state.streamStatus) {
      document.getElementById('stream').src = "data:image/jpeg;base64," + data
    }
    
  }


  startStream() {
    this.state.streamingServer.send("start stream")
    this.setState({streamStatus:true})
  }

  endStream() {
    this.state.streamingServer.send("end stream")
    this.setState({streamStatus:false})
  }

  drawLine(angle,contactDistance){
    /**
     * the servo goes from 90 to -90 and the servo's -90, is actually 0 here as the
     * servo has 0 degrees as its starting position when its pointing perpendicular
     * to the x and y axis instead of the right x axis being 0 degrees.
     *  */ 
    console.log("draw line")
    let distanceRatio = (contactDistance/100 * this.radius)
    let radians = (Math.PI/180.0) * -(angle + 90)
    let canvas = document.getElementById("sonarCanvas");
    let canvasContext = canvas.getContext("2d");
    if (angle === 90 || angle === -80) {
      canvasContext.putImageData(this.state.cleanSonar,0,0)
    }
    
    let yDistance = distanceRatio * Math.sin(radians)
    let xDistance = distanceRatio * Math.cos(radians)
    let greenlineCoordinates = [this.centerX + xDistance,this.centerY + yDistance]
    canvasContext.strokeStyle = this.green
    canvasContext.beginPath()
    canvasContext.moveTo(this.centerX,this.centerY)
    canvasContext.lineTo(this.centerX + xDistance,this.centerY + yDistance)
    canvasContext.stroke()
    
    canvasContext.strokeStyle = this.red
    canvasContext.beginPath()
    canvasContext.moveTo(greenlineCoordinates[0],greenlineCoordinates[1])
    let leftOverRadius = this.radius - distanceRatio
    yDistance = leftOverRadius * Math.sin(radians)
    xDistance = leftOverRadius * Math.cos(radians)
    canvasContext.lineTo(greenlineCoordinates[0] + xDistance,greenlineCoordinates[1] + yDistance)
    canvasContext.stroke()

  }

  render() {
    return (
      <div id="mainPage">
        <Header  />
        <ConnectionPanel
          createConnection={this.createConnection}
          commandServerConnected={this.state.commandServerConnected}
          streamServerConnected={this.state.streamServerConnected}
        />

        <div id="controlsAndVideoPane" onKeyDown={this.sendDirection} tabIndex="0" onKeyUp={this.stopMoving}>
          <ControlPanel
            arrowUp={this.state.arrows['ArrowUp']}
            arrowDown={this.state.arrows['ArrowDown']}
            arrowLeft={this.state.arrows['ArrowLeft']}
            arrowRight={this.state.arrows['ArrowRight']} />
          <StreamPanel startStream={this.startStream}
                       endStream={this.endStream} />
        </div>
        <SonicRadarDisplay></SonicRadarDisplay>
        <HistoryPanel  recivedCommandSets = {this.state.recivedCommandSets} commandServerSocket = {this.state.commandServer} commandAndTime = {this.state.commandAndTime} />
        
      </div>
    );
  }
}



export default App;
