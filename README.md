# GLVis JavaScript Library

Using [Emscripten](https://emscripten.org/index.html) GLVis can be built as a JavaScript & WebAssembly library.

## Using a pre-built version of the _glvis.js_ library

A pre-built JavaScript library is included at _src/glvis.js_ but because of its size it
is stored using Git's Large File Storage, [git-lfs](https://git-lfs.github.com/).

To use the pre-built library, e.g. with the examples in the `examples/` directory, you need
first to enable `git-lfs` on your system, see the instructions on the [git-lfs page](https://git-lfs.github.com/).

For example, a simple run with the pre-built library can be executed on a Mac from scratch with:

```
brew install git-lfs
git lfs install
git clone git@github.com:GLVis/glvis-js.git
cd glvis-js/examples
open basic.html
```

### Streaming from MFEM

The _examples/websockets.html_ webpage can be used for inline visualization from MFEM with the
`m2w.py` script. `m2w.py` forwards MFEM visualization messages to the webpage using websockets.

Example usages:

1. `cd glvis-js && ./m2w.py`

  - must be run first!
  - assumes default MFEM port of `19916`

2. Open (or reload) _examples/websockets.html_

  - assumes default websocket port of `8080`

3. `cd mfem/examples && ./ex1` or `cd mfem/examples && ./ex9 -vs 20`

4. `ctrl-c` to stop `m2w.py`

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

## Updating _glvis.js_

1. After building copy the new _glvis.js_ into the _src_ directory.

2. Please add the output of `make versions` to the commit body.

## Known issues and limitations

- The Library only supports GLVis stream data

- Lots of console warnings

- "Updating" data results in a totally new visualization

  - keys are not preserved
  - unnecessary computation
  - memory leaks can lead to OOM in the JS runtime
