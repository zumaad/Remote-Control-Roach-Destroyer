# Remote-Control-Roach-Destroyer

### A remote control robot controlled with a raspberrypi.

### Current progress

I can control the robot remotely and have it stream back the camera feed to the client (browser)!

### Goals: 
- Be able to control the robot remotely (move it around) through a web interface using the websockets protocol. DONE!
- Have it also stream back a camera feed of its surroundings. DONE!
- I should also be able to have control over the command history of the robot so you can choose commands to save, what commands to play back, choose a set of commands to play in reverse so it goes back to its original position, etc. 
- Be able to visualize its path and try to come up with cool ideas about it communicating its position and stuff like that.

Long term goals: Give it have a laser that I can also control remotely. Have it be able to process the camera feed and recognize objects using ML :)

### Overview: 
- Webserver (literally just a while True loop that waits for messages) runs on raspberrypi and listens on a certain port for client's messages. 
- Through a web interface (made with javascript using the native WebSocket API to communicate with the server), I connect to the server.
- I send messages to the server by listening for key events like the arrow key events.
- server recieves a message and passes it to the execute_message() method of the robot object I made to encapsulate the robot logic (moving servos, remembering commands,etc).
- For streaming the camera feed back to my browser, I have another server running on a different port that gets the camera data as a byte string, encodes that in a base64 string (cause you can construct html images out of a base64 string) and sends it the client. On the client side a javascript function takes that base64 string and keeps on updating the source of an image everytime it recieves data (which is every frame). I could also send the binary data directly over the websocket connection instead of encoding it, but then I would have to construct an image out the blob object I get in javascript which doesn't seem to have any benefits to this method.


#### Why WebSockets and not http or another protocol?
I want a way to push data from the server without the client having to keep requesting it (the camera feed) and I also want to be sending messages really frequently (potentially every time someone presses a certain key). Sending http requests rapidly through javascript (using fetch API,for example, causes the interface to lag). Lastly, Python, which all of my backend code is in, has a pretty good library for using websockets and javascript also has a native API for dealing with them.

#### how is the robot frame built?

I used something called Meccano. It serves the same purpose as LEGO, except it's metal. So there are lots of metal "building blocks" like metal strips with holes, brackets, gears, wheels, rods, platforms, screws,nuts, etc. 
