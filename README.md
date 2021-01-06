# GLVis JavaScript Library

Using [Emscripten](https://emscripten.org/index.html) GLVis can be built as a JavaScript & WebAssembly library.

A full-featured web GLVis is available at https://glvis.org/live with documentation available [here](live/README.md). 

## Using a pre-built version of the _glvis.js_ library

A pre-built JavaScript library is included at _src/glvis.js_ but because of its size it
is stored using Git's Large File Storage, [git-lfs](https://git-lfs.github.com/).

To use the pre-built library, e.g. with the examples in the `examples/` directory, or with the full-featured
web version of GLVis in the `live/` directory, you need
first to enable `git-lfs` on your system, see the instructions on the [git-lfs page](https://git-lfs.github.com/).

For example, a simple run with the pre-built library can be executed on a Mac from scratch with:

```
brew install git-lfs
git lfs install
git clone git@github.com:GLVis/glvis-js.git
cd glvis-js/examples
open basic.html
```

## Building _glvis.js_

1. Install [Emscripten](https://emscripten.org/docs/getting_started/downloads.html)

2. Clone included submodules

    ```
    git clone --recurse-submodules git@github.com:GLVis/glvis-js.git
    ```

   If you've already cloned you can pull submodules with:

   ```
   git submodule update --init --recursive
   ```

3. Get a copy of _OpenSans.ttf_ and put it in the GLVis root directory. For example

   ```
   cd glvis-js
   curl -s -o ../glvis/OpenSans.ttf https://raw.githubusercontent.com/google/fonts/master/apache/opensans/OpenSans-Regular.ttf
   ```

4. Build:

   ```
   make -j
   cp ../glvis/lib/libglvis.js src/glvis.js
   ```

NOTE: Emscripten handles SDL2 and GLEW but if you have another installation in your path the link
might fail.


## Serving to a device on your local network

The `servewide` make target allows you to serve your local glvis-js to other devices on your
network.

For example, on a Mac:

1. First, get your IP address:

   ```shell
   ipconfig getifaddr en0
   ```

2. Then, serve `glvis-js` to all devices in your local network:

   ```shell
   make servewide
   ```

3. Any device in your network can now connect to `{your IP address}:8000` to use the local version of `glvis-js`.


## Contributing

Please run `make style` before pushing your changes. `make style` uses
[`prettier`](https://prettier.io) and requires that you have
[`npx`](https://www.npmjs.com/package/npx) in your path. `prettier` will
be installed for you when running `make style` if you don't already have it.

### Updating _glvis.js_

1. Use `make install` to build and install a new `glvis.js` and `versions.js` to *src/*

2. Please add the output of `make versions` to the commit body.


## Known issues and limitations

- Opening new examples results in memory growth

- Fullscreen events captured by the Emscripten Module are difficult to control

  - Setting a noop with `emscripten_set_fullscreenchange_callback` doesn't seem to do it
  - `_JSEvents_requestFullscreen` in _glvis.js_ takes over the whole screen
  - `_emscripten_set_canvas_element_size` and `__set_canvas_element_size` print errors and duplicate
    some existing behavior

- Lots of console warnings
