## Loading external files

The *live* page will parse the `stream` html argument and try to load it in place of the default.
The format for this is `<site>/live?stream=<url>`

For example, https://glvis.org/live?stream=https://glvis.org/data/ex9.saved will fetch *ex9.saved*
from glvis.org and render it instead of the normal *quad.saved* on startup. You can do the same thing with
data from an external site or if you're hosting locally after running `make servelocal` or `make servewide`:
https://localhost:8000/live/stream=https://glvis.org/data/ex9.saved


## Streaming from MFEM

*live* can be used to view MFEM visualization messages via `glvis-browser-server`, which forwards MFEM messages
to the webpage using websockets.

On *live*, the `Setup` menu has controls for connecting to and disconnecting from a `glvis-browser-server`
along with pausing and resuming the rendering of incoming messages.

Example usages:

1. `cd glvis-js && ./glvis-browser-server`
    - requires Python 3.7+
    - assumes default MFEM port of 19916

2. Visit https://glvis.org/live or `open glvis-js/live` (on Mac)

2. Open the `Setup` menu and click the `Connect` button
    - default host and websocket port are `localhost:8080`
    - there is a `Pause`/`Resume` button below the `Connect` button that can be used to pause the stream or,
    in the case that a "pause" message was sent, resume the stream
    - Does not work in Safari from https://glvis.org/live, which seems to require a secure websocket

3. `cd mfem/examples && ./ex9`

4. `ctrl-c` to stop `glvis-browser-server`

## Fullscreen

In the lower-right corner of the *live* page there is a `⤢` button for expanding to fullscreen.
In fullscreen all elements besides the visualization itself are hidden, follow your browsers 
instructions or use the `esc` key exit.
