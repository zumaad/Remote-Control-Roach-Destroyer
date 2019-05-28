# Remote-Control-Roach-Destroyer

A remote control robot controlled with a raspberrypi.

Goals: Be able to control it remotely (move it around) through a web interface using the websockets protocol. Have it also stream back a camera feed of its surroundings. Should also be able to have control over the command history of the robot so you can choose what to save, what commands to play back, choose a set of commands to play in reverse so it goes back to its original position, etc.

long term goals: Give it have a laser that I can also control remotely. Have it be able to process the camera feed and recognize objects using ML.

Overview: Webserver constantly runs on raspberrypi and listen on a certain port for client's messages. Through a web interface (made with javascript using the native WebSocket API to communicate with the server), I connect to the server and can send messages by pressing arrow keys (the up arrows sends "arrowUp"). These messages are processed by the server and are passed to the robot class which then delegates to the appropriate methods which have control over the servos. 


