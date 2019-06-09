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
  let commandServerText = props.commandServerConnected ? "command server connected" : "command server not connected"
  let streamServerText = props.streamServerConnected ? "streaming server connected" : "streaming server not connected"
  return (
    <div id="connectionPane">
      <button onClick={props.createConnection} className='btn nightowlButtons' id="connectButton"> Connect! </button>
      <p id="connectedText"> {commandServerText + ' and ' + streamServerText}</p>
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
    let button = this.state.buttonPressed ? "" : <button id="startStream" className="btn nightowlButtons" onClick={this.prepareStreamBox}> Start Stream!</button>
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
      {"name1":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name2":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name3":[{command:'ArrowRight',time:166613},{command:'ArrowLeft',time:66641}],
      "name4":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name5":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name6":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name7":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name8":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name9":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name10":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name11":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name12":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name13":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name14":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name15":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name16":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name17":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}],
      "name18":[{command:'ArrowUp',time:123213},{command:'ArrowDown',time:751241}]},
      currentSet:null,
      lastTime:null}
      
      this.pushSelected = this.pushSelected.bind(this);
      this.createCommandSets = this.createCommandSets.bind(this);
  }

  componentWillReceiveProps() {
    if (this.state.currentSet) {
      let recievedCommand,recievedTime;
      [recievedCommand,recievedTime] = this.props.commandAndTime
      if (recievedTime != this.state.lastTime) {
        let copiedCommandSet = JSON.parse(JSON.stringify(this.state.commandSets))
        copiedCommandSet[this.state.currentSet].push({command:recievedCommand,time:recievedTime})
        this.setState({commandSets:copiedCommandSet,lastTime:recievedTime})
      }
      }
    }
  
  pushSelected(setName) {
    this.setState({currentSet:setName})
  }

  createCommandSets() {
    let elementArray = []
    for (let name in this.state.commandSets){
      elementArray.push(<CommandSet pushSelectedFunc = {this.pushSelected} setName = {name} commands = {this.state.commandSets[name]}/>)
    }
    return elementArray
  }



  render() {
    return (
      <div>
        <HistoryControlsContainer/>
        <CommandSetContainer createCommandSetsFunc = {this.createCommandSets}/>
        {this.state.currentSet && <ViewSelectedCommandSet setName = {this.state.currentSet} commandSets = {this.state.commandSets }/>}
      </div>
    )
  }
}

function CommandSetContainer(props){
  return (
    <div id = "commandSetLabelDiv">
      <h4> <i> Command Sets</i></h4>
      <div id = "commandSetContainer">
        {props.createCommandSetsFunc()}
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
          <button id="historyButton" className="btn nightowlButtons"> Turn history on</button>
          <button className="btn nightowlErrorButton"> Flush current set</button>
          <button className="btn nightowlPurpleButton"> New set</button>
        </div>
      </div>
    </div>
    
  )
}

function CommandSet(props) {
    return (
      <div className = "commandSet">
        <p style = {{fontSize:'1.5em'}}> {props.setName} </p>
        <div>
          <button className = "btn nightowlErrorButton"> Delete </button>
        </div>
        <div>
          <button className = "btn nightowlGreenButton"> Play </button>
        </div>
        <div>
          <button> Clear </button>
        </div>
        <div>
          <button onClick = {()=>props.pushSelectedFunc(props.setName)}> Select</button>
        </div>
      </div>
    )
}

function ViewSelectedCommandSet(props) {
  return (
    <div id = "specificSet">
      <p> {props.setName}</p>
      {props.commandSets[props.setName].map((command) => <p> {command.command} {command.time} </p>)}
    </div>
  )

}
  






class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamingServer: null,
      commandServer: null,
      streamingServerAddress: "ws://192.168.1.3:8764",
      commandServerAddress: "ws://192.168.1.3:8765",
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
      this.setState({ arrowPressed: true ,commandAndTime:[event.key,new Date().getTime()]})
      this.changeArrowDisplay(event.key, 'on')


    }
  }

  stopMoving(event) {
    if (event.key in this.state.arrows) {
      // this.state.commandServer.send("stop")
      this.setState({ arrowPressed: false })
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
      <div id="mainPage" onKeyDown={this.sendDirection} tabIndex="0" onKeyUp={this.stopMoving}>

        <Header />
        <ConnectionPanel
          createConnection={this.createConnection}
          commandServerConnected={this.state.commandServerConnected}
          streamServerConnected={this.state.streamServerConnected}
        />

        <div id="controlsAndVideoPane">
          <ControlPanel
            arrowUp={this.state.arrows['ArrowUp']}
            arrowDown={this.state.arrows['ArrowDown']}
            arrowLeft={this.state.arrows['ArrowLeft']}
            arrowRight={this.state.arrows['ArrowRight']} />
          <StreamPanel startStream={this.startStream} />
        </div>

        <HistoryPanel commandAndTime = {this.state.commandAndTime} />
      </div>


    );
  }
}



export default App;
