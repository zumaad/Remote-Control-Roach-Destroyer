import asyncio
import time
import websockets
from robot_code import robot
from io import BytesIO
from picamera import PiCamera
import base64
import json

def process_command_set(command_set):
    return [(command_set[i]["command"],command_set[i+1]["time"] - command_set[i]["time"]) for i in range(0,len(command_set),2)]

    

async def main_message_handler(websocket, path):
    print("client connected!")
    # roach_destroyer = robot.Robot()
    print("roach destroyer initialized!")
    while True:
        message = await websocket.recv()
        deserialized_message = json.loads(message)
        print(deserialized_message)
        # roach_destroyer.execute_command(deserialized_message)
        
start_server = websockets.serve(main_message_handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()