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
        bytes_from_frame = my_stream.getvalue()
        base64str = base64.encodestring(bytes_from_frame).decode()
        await websocket.send(base64str)
        await asyncio.sleep(.05)

    
 
async def main_message_handler(websocket, path):
    print("client connected to streaming server!")
    streaming_task = None
    while True:
        message = await websocket.recv()
        print(message)

        if message == 'start stream':
            print("starting stream!")
            streaming_task = asyncio.ensure_future(start_streaming(websocket))
        elif message == 'end stream':
            print("ending stream")
            if streaming_task:
                streaming_task.cancel()
                streaming_task = None


        
        
start_server = websockets.serve(main_message_handler, '0.0.0.0', 8764)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()