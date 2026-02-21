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

`glvis-js` releases are used by `pyglvis` directly through the repo [GLVis/releases-js](https://github.com/GLVis/releases-js) -- see [Updating pyglvis](#pyglvis) for more info.

If you just want to update `glvis-js` to use the latest `MFEM` or `glvis`,
there is a [workflow script](https://github.com/GLVis/glvis-js/blob/master/.github/workflows/build.yml) setup that can be used to automatically build and create a new branch.
Upon a successful build, simply merge this new branch into `master`: ((example)[https://github.com/GLVis/glvis-js/pull/35]).

Copy the new files in `src/` into [GLVis/releases-js](https://github.com/GLVis/releases-js) for use in `pyglvis`.


<a name="pyglvis"></a>
## Updating `pyglvis`

`pyglvis` uses `esm.sh` to pull a specific version of `glvis-js`.
To update `pyglvis` to use a newer version edit this line in [pyglvis/glvis/widget.js](https://github.com/GLVis/pyglvis/blob/main/glvis/widget.js)

```javascript
import glvis from "https://esm.sh/gh/glvis/releases-js@gh-pages/glvis-js-0.3";
```

`pyglvis` depends on `pymfem` so please consider the `MFEM` version that `glvis-js` was built with before updating.
See the [dependency graph](https://github.com/GLVis/pyglvis?tab=readme-ov-file#pyglvis-dependencies).


## Known issues and limitations

- Opening new examples results in memory growth

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
