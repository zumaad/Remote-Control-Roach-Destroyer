import asyncio
import time
import websockets
from robot_code import robot




    
async def main_message_handler(websocket, path):
    roach_destroyer = robot.Robot()
    while True:
        message = await websocket.recv()
        print("this is the robot that was inited at " + str(roach_destroyer.init_at))
        print("recieved " + message + " and am passing it to roach_destroyer")
        roach_destroyer.execute_command(message)
        
        



start_server = websockets.serve(main_message_handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()