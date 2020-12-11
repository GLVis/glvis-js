# GLVis JavaScript Library

Using [emscripten](https://emscripten.org/index.html) GLVis can be built as a Javascript library.

A pre-built JavaScript library is included at *js/glvis.js* but because of its size it
is stored using git-lfs; please see the [git-lfs instructions](https://git-lfs.github.com/) for more info.

## Building *glvis.js*

1) Install [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

2) Get a copy of *OpenSans.ttf* and put it at the root of this directory

3) Build:

```bash
> make -j
> cp ../glvis/lib/libglvis.js js/glvis.js
```

NOTE: emscripten handles SDL2 and GLEW but if you have another installation in your path the link
might fail.

## Known Issues

* The Library only supports GLVis stream data
* Reloading data results in warnings in the console

## Updating *glvis.js*

After building just copy the new *glvis.js* into the *js* directory.
Please add the output of `make versions` to the commit body.
