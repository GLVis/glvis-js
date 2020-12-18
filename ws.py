#!/usr/bin/env python

import asyncio
import websockets
import time
import argparse
import socket
from concurrent.futures import ProcessPoolExecutor

import logging
logger = logging.getLogger('websockets.server')
logger.setLevel(logging.ERROR)
logger.addHandler(logging.StreamHandler())


parser = argparse.ArgumentParser()
parser.add_argument("--ws-port", type=int, default=8080)
parser.add_argument("--port", type=int, default=19916)

args = parser.parse_args()


async def ws_handler(queue, websocket, path):
    print("processing ws")
    while True:
        msg = await queue.get()
        print(f"sending {msg[0:min(len(msg), 20)]}...")
        await websocket.send(msg)


async def tcp_handler(queue, reader, writer):
    print("got client")
    cnt = 0
    full_msg = b""
    while True:
        msg = await reader.readline()
        if not msg: break
        size = len(msg)
        #print(f"got msg (len = {size}): {msg[0:min(size, 20)]}...")
        full_msg += msg
        if b"pause" in msg: 
            print(f"put: {cnt} lines")
            queue.put_nowait(full_msg.decode())
            full_msg = b""
        cnt += 1


async def create_tcp_server(queue):
    async def handler_wrap(reader, writer):
        await tcp_handler(queue, reader, writer)


    print("creating server...")
    server = await asyncio.create_task(asyncio.start_server(handler_wrap, host="localhost", port=args.port))
    print("created server, serving")
    await server.serve_forever()


#asyncio.get_event_loop().run_until_complete(ws_serve)
#asyncio.get_event_loop().run_forever()

#asyncio.run(ws_serve)

async def main():
    queue = asyncio.Queue()

    async def ws_handler_wrap(websocket, path):
        await ws_handler(queue, websocket, path)


    ws_server = websockets.serve(ws_handler_wrap, "localhost", args.ws_port)
    t2 = asyncio.create_task(create_tcp_server(queue))

    await ws_server
    await t2

asyncio.run(main())
