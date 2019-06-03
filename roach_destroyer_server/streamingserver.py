import asyncio
import time
import websockets
from io import BytesIO
from picamera import PiCamera
import base64



async def start_streaming(websocket):
    camera = PiCamera()
    camera.resolution = (700, 400)
    time.sleep(2)
    while True:
        my_stream = BytesIO()
        camera.capture(my_stream,quality=20,format ='jpeg',use_video_port=True)
        bytes_from_stream = my_stream.getvalue()
        print(len(bytes_from_stream))
        base64str = base64.encodestring(bytes_from_stream).decode()
        await websocket.send(base64str)
        asyncio.sleep(.05)

    



 
async def main_message_handler(websocket, path):
    print("client connected!")

    while True:
        message = await websocket.recv()
        print(message)

        if message == 'start stream':
            print("starting stream!")
            asyncio.ensure_future(start_streaming(websocket))
        
        
start_server = websockets.serve(main_message_handler, '0.0.0.0', 8764)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()