# GLVis JavaScript Library

Using [emscripten](https://emscripten.org/index.html) GLVis can be built as a JavaScript library.

## Using a pre-built version of the _glvis.js_ library

A pre-built JavaScript library is included at _js/glvis.js_ but because of its size it
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

## Building _glvis.js_

1. Install [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

2. Get a copy of _OpenSans.ttf_ and put it at the root of this directory

3. Build:

```bash
> make -j
> cp ../glvis/lib/libglvis.js js/glvis.js
```

NOTE: emscripten handles SDL2 and GLEW but if you have another installation in your path the link
might fail.

## Updating _glvis.js_

1. After building copy the new _glvis.js_ into the _js_ directory.

2. Please add the output of `make versions` to the commit body.

## Known Issues

- The Library only supports GLVis stream data

- Reloading data results in warnings in the console
