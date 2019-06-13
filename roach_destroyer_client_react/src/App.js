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
  }

  prepareStreamBox() {
    this.setState({ buttonPressed: true }, this.props.startStream)
  }

  render() {
    let button = this.state.buttonPressed ? null : <button id="startStream" className="btn nightowlButtons" onClick={this.prepareStreamBox}> Start Stream!</button>
    let streamImage = this.state.buttonPressed ? <img id='stream' style={{ padding: '10px' }} /> : ""
    return (
      <div id="streamContainer">
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
    }

  playSet() {
    if (this.state.currentSet && this.props.commandServerSocket.readyState === 1){
      this.props.commandServerSocket.send(JSON.stringify(this.state.commandSets[this.state.currentSet]))
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
    this.setState({commandSets:copiedCommandSet,justCreated:setName},() => this.scroller.current.scrollIntoView())
    

  }

  render() {
    return (
      <div>
        <HistoryControlsContainer 
        pushNewSet = {this.pushNewSet}
        deleteSet = {this.deleteSet}
        flushSet = {this.flushSet}
        playSet = {this.playSet}/>

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
          <button onClick = {props.playSet} className = 'btn nightowlGreenButton spacedBtn'> Play</button>
          <button className = 'btn nightowlPurpleButton spacedBtn'> Reverse </button>
          <button onClick = {props.deleteSet} className = 'btn nightowlErrorButton spacedBtn'> Delete</button>
          <CreateSetButton pushNewSet = {props.pushNewSet}/>
          <button onClick = {props.flushSet} className="btn nightowlOrangeButton spacedBtn"> Flush</button>
          <button className = 'btn nightowlBlueButton spacedBtn'> Upload</button>
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


  
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamingServer: null,
      commandServer: null,
      streamingServerAddress: "ws://192.168.1.3:8764",
      commandServerAddress: "ws://localhost:8765",
      commandServerConnected: false,
      streamServerConnected: false,
      arrowPressed: false,
      arrows: { 'ArrowUp': 'unlitArrowUp', 'ArrowDown': 'unlitArrowDown', 'ArrowRight': 'unlitArrowRight', 'ArrowLeft': 'unlitArrowLeft' },
      commandAndTime:[]

    }
    this.createConnection = this.createConnection.bind(this);
    this.sendDirection = this.sendDirection.bind(this);
    this.stopMoving = this.stopMoving.bind(this);
    this.changeArrowDisplay = this.changeArrowDisplay.bind(this)
    this.startStream = this.startStream.bind(this);
  }

  createConnection() {
    let commandSocket = new WebSocket(this.state.commandServerAddress)
    commandSocket.onopen = () => (this.setState({ commandServer: commandSocket, commandServerConnected: true }))

    let streamingSocket = new WebSocket(this.state.streamingServerAddress)
    streamingSocket.onopen = () => this.setState({ streamingServer: streamingSocket, streamServerConnected: true })
    streamingSocket.onmessage = (event) => this.handleStreamMessages(event.data)
  }

  sendDirection(event) {
    event.preventDefault();
    if (!this.state.arrowPressed & event.key in this.state.arrows) {
      // this.state.commandServer.send(event.key)
      let keyAndTime = [event.key,new Date().getTime()]
      this.setState({ arrowPressed: true ,commandAndTime:keyAndTime})
      this.changeArrowDisplay(event.key, 'on')


    }
  }

  stopMoving(event) {
    if (event.key in this.state.arrows) {
      // this.state.commandServer.send("stop")
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
    document.getElementById('stream').src = "data:image/jpeg;base64," + data
  }


  startStream() {
    this.state.streamingServer.send("start stream")
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
          <StreamPanel startStream={this.startStream} />
        </div>

        <HistoryPanel commandServerSocket = {this.state.commandServer} commandAndTime = {this.state.commandAndTime} />
      </div>


    );
  }
}



export default App;
