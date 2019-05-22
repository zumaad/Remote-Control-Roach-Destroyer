import asyncio
import time
import websockets

    
async def main_message_handler(websocket, path):
    while True:
        
        message = await websocket.recv()
        print("recieved " + message + " and am passing it to consumer")
        await websocket.send("moving " + message + ". This is running in the background")
        



start_server = websockets.serve(main_message_handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()