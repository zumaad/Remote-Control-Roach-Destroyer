# Remote-Control-Roach-Destroyer

### A remote control robot controlled with a raspberrypi.

### Goals: 
- Be able to control the robot remotely (move it around) through a web interface using the websockets protocol. 
- Have it also stream back a camera feed of its surroundings. 
- I should also be able to have control over the command history of the robot so you can choose commands to save, what commands to play back, choose a set of commands to play in reverse so it goes back to its original position, etc.

Long term goals: Give it have a laser that I can also control remotely. Have it be able to process the camera feed and recognize objects using ML.

### Overview: 
- Webserver (literally just a while True loop that waits for messages) runs on raspberrypi and listens on a certain port for client's messages. 
- Through a web interface (made with javascript using the native WebSocket API to communicate with the server), I connect to the server.
- I send messages to the server by listening for key events like the arrow key events.
- server recieves a message and passes it to the execute_message() method of the robot object I made to encapsulate the robot logic (moving servos, remembering commands,etc).


#### Why WebSockets and not http or another protocol?
I want a way to push data from the server without the client having to keep requesting it (eventually the raspberrypi will be streaming the camera feed) and I also want to be sending messages really frequently (potentially every time someone presses a certain key). Sending http requests rapidly through javascript (using fetch API,for example, causes the interface to lag). Lastly, Python, which all of my backend code is in, has a pretty good library for using websockets and javascript also has a native API for dealing with them.

