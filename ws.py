#!/usr/bin/env python

#
# m2w.py is an mfem to websocket forwarder to make it easier to use glvis-js as a viewer for inline
# mfem visualization. m2w.py must be run before opening the web-client and mfem.
#
# m2w.py requires the websockets Python library (pip install websockets) and have been tested with
# Python 3.7. Earlier versions may work.
#

import argparse
import asyncio
import logging
import websockets

logger = logging.getLogger('websockets.server')
logger.setLevel(logging.ERROR)
logger.addHandler(logging.StreamHandler())

parser = argparse.ArgumentParser()
parser.add_argument("--ws-port", type=int, default=8080)
parser.add_argument("--port", type=int, default=19916)

args = parser.parse_args()


async def ws_handler(queue, websocket, path):
    print("websocket client connected")
    while True:
        msg = await queue.get()
        print(f"sending {msg[0:min(len(msg), 20)]}...")
        await websocket.send(msg)
    print("websocked client disconnected")


async def mfem_handler(queue, reader, writer, timeout=1, block_size=1024):
    print("mfem client connected")
    msg = b""

    while True:
        try:
            block = await asyncio.wait_for(reader.read(block_size), timeout)
            if not block: break
            idx = block.rfind(b"solution")
            if (idx != -1 and msg) or idx > 0:
                print(f"found delimiter at {idx}")
                msg += block[:idx]
                queue.put_nowait(msg.decode())
                msg = block[idx:]
            else:
                msg += block
        except asyncio.TimeoutError:
            if len(msg) > 0:
                queue.put_nowait(msg.decode())
                msg = b""

    if msg: queue.put_nowait(msg.decode())
    print("mfem client disconnected")


async def create_mfem_server(queue):
    print("mfem server: starting")

    async def handler_wrap(reader, writer):
        await mfem_handler(queue, reader, writer)
    server = await asyncio.create_task(asyncio.start_server(handler_wrap, host="localhost", port=args.port))
    await server.serve_forever()
    print("mfem server: complete")


async def main():
    queue = asyncio.Queue()

    async def ws_handler_wrap(websocket, path):
        await ws_handler(queue, websocket, path)

    ws_server = websockets.serve(ws_handler_wrap, "localhost", args.ws_port)
    t2 = asyncio.create_task(create_mfem_server(queue))

    await ws_server
    await t2

asyncio.run(main())
