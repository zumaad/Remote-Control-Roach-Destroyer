# Remote-Control-Roach-Destroyer

### A remote control robot controlled with a raspberrypi.

## TENTATIVE DEMOS (going to record them again, but horizontally this time....and with better quality)

1. This video demos sonar obstacle detection, camera streaming, and movement
https://youtu.be/vQvloFHlsto
 :14 for the camera streaming :50 for the sonar

2. This video showcases just the sonar capabilites 
https://youtu.be/plLTiLzj7nk

3. This video showcases just the camera streaming
https://youtu.be/7o7IftcbYTc

4. This video demos the ability to reverse previously issued commands to move the robot back to where it started from automatically
https://youtu.be/U3DQXjrbG60





### Current progress
I
- can control the robot remotely(make it move in all directions,turn on camera,sonar, etc)
- can stream back its surroundings with the camera and see it on the frontend
- can stream back sonar data that I get from the sonar sensor and then use it to create a radar chart that allows me to see the distances of objects around my robot
- can store sets of commands on the front end and then play them again,play them in reverse, or upload them to the robot to be accessed later.
- can control when the background tasks like the sonar sensor/servo,playbacks,or camera turn on and off.


### Overview: 
- Webserver (literally just a while True loop that waits for messages) runs on raspberrypi and listens on a certain port for client's messages. 
- Through a web interface (made with javascript using the native WebSocket API to communicate with the server), I connect to the server.
- I send messages to the server by listening for key events like the arrow key events.
- server recieves a message and passes it to the process_message() method of the robot object I made to encapsulate the robot logic (moving servos, remembering commands,etc).
- For streaming the camera feed back to my browser, I have another server running on a different port that gets the camera data as a byte string, encodes that in a base64 string (cause you can construct html images out of a base64 string) and sends it the client. On the client side a javascript function takes that base64 string and keeps on updating the source of an image everytime it recieves data (which is every frame). I could also send the binary data directly over the websocket connection instead of encoding it, but then I would have to construct an image out the blob object I get in javascript which doesn't seem to have any benefits to this method.
- The sonar sensor is placed on a servo that rotates around 180 degrees. I get the sonar data and the angle the servo is currently at and send that information to the frontend. I then render it on an html canvas object that is my "Radar chart". 

#### Why WebSockets and not http or another protocol?
I want a way to push data from the server without the client having to keep requesting it (the camera feed) and I also want to be sending messages really frequently (potentially every time someone presses a certain key). Sending http requests rapidly through javascript (using fetch API,for example, causes the interface to lag). Lastly, Python, which all of my backend code is in, has a pretty good library for using websockets and javascript also has a native API for dealing with them.

#### how is the robot frame built?

I used something called Meccano. It serves the same purpose as LEGO, except it's metal. So there are lots of metal "building blocks" like metal strips with holes, brackets, gears, wheels, rods, platforms, screws,nuts, etc. 
