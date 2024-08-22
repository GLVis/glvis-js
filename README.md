# GLVis JavaScript Library

Using [Emscripten](https://emscripten.org/index.html) GLVis can be built as a JavaScript & WebAssembly library.

A fully-featured web version of GLVis is available at https://glvis.org/live with documentation in [live/README.md](live/README.md).

## Using a pre-built version of the _glvis.js_ library

A pre-built JavaScript library is included at _src/glvis.js_, but because of its size it
is stored using Git's Large File Storage, [git-lfs](https://git-lfs.github.com/).

To use the pre-built library, e.g. with the examples in the `examples/` directory, or with the web version
in the `live/` directory, you need first to enable `git-lfs` on your system, see the instructions on the
[git-lfs page](https://git-lfs.github.com/).

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

   ```
   [git clone https://github.com/emscripten-core/emsdk.git]
   cd emsdk
   git pull
   ./emsdk install latest
   ./emsdk activate latest
   source "/path/to/emsdk/emsdk_env.sh"
   ```

2. Get copies of glvis and mfem

   ```
   git clone git@github.com:mfem/mfem.git
   git clone git@github.com:GLVis/glvis.git
   ```

3. Clone included submodules

    ```
    git clone --recurse-submodules git@github.com:GLVis/glvis-js.git
    ```

   If you've already cloned you can pull submodules with:

   ```
   git submodule update --init --recursive
   ```

4. Build:

   ```
   make realclean # or just clean if you don't want to rebuild mfem
   make install -j
   ```

5. Patch glvis.js (temporary):

   Edit src/glvis.js and add `return 0;` to the top of `_JSEvents_requestFullscreen` (see Known
   Issues)


NOTE: Emscripten handles SDL2 and GLEW but if you have another installation in your path the link
might fail.


## Serving to a device on your local network

The `serve` make target allows you to serve your local glvis-js to other devices on your
network.

For example, on a Mac:

1. First, get `your IP address`:

   ```shell
   ipconfig getifaddr en0
   ```

   or alternatively your `hostname`:

   ```shell
   hostname -s
   ````

2. Then, serve `glvis-js` to all devices in your local network:

   ```shell
   make serve
   ```

3. Any device in your network can now connect to `{your IP address}:8000` or `{hostname}:8000` to use the local version of `glvis-js`. On the local host, you can also use `localhost:8000`.


## Contributing

Please run `make style` before pushing your changes. `make style` uses
[`prettier`](https://prettier.io) and requires that you have
[`npx`](https://www.npmjs.com/package/npx) in your path. `prettier` will
be installed for you when running `make style` if you don't already have it.

### Updating _glvis.js_

1. Use `make install` to build and install a new `glvis.js` and `versions.js` to *src/*

2. Please add the output of `make versions` to the commit body.


## Releasing

1. Update the version: `npm version <update_type>`
   - `<update_type>` is one of `patch`, `minor`, or `major`

2. `npm login`

3. `npm publish`

More info [here](https://docs.npmjs.com/updating-your-published-package-version-number).


## Known issues and limitations

- Opening new examples results in memory growth

- Fullscreen events captured by the Emscripten Module are difficult to control

  - `_JSEvents_requestFullscreen` in _glvis.js_ takes over the whole screen
    - For now we patch this to be a noop
    - Setting a noop with `emscripten_set_fullscreenchange_callback` doesn't seem to do it
  - `_emscripten_set_canvas_element_size` and `__set_canvas_element_size` print
  errors and duplicate some existing behavior

- Lots of console warnings


## TODO
- Multiple output windows
   - MFEM stream with multiple fields causes the visualizations to write over each other
- Improve the I/O e.g. corresponding to key `F6`
- Improve experience on mobile devices with touch interfaces
- Allow for screenshots/printing with `S`/`Ctr-P`, see https://github.com/GLVis/pyglvis/issues/5
- Provide easier ways to generate `*.saved` files
- Support Binary streams
- Browser differences
  - Fullscreen in Safari
  - Help menu overflow in Safari and Firefox
- Secure websockets
