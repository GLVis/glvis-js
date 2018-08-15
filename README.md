# GLVis JavaScript Library and Jupyter Widget

Using [Emscripten](https://github.com/kripken/emscripten) GLVis can be built as a Javascript library.
A pre-built JavaScript library is included at *glvis-widget/js/lib/libglvis.js* but because of its size it
is stored using git-lfs; please see the [git-lfs instructions](https://git-lfs.github.com/) for more info.

## Installing GlvisWidget

See *glvis-widget/README.md* for more info.

```bash
$ cd glvis-widget
$ pip install .
$ jupyter nbextension enable --py --sys-prefix glvis_widget
```

## Building *libglvis.js*

In order to build *libglvis.js* you'll need to install Emscripten and either
clone the glm submodule or have glm installed already. Emscripten handles
SDL2 and GLEW but if you have another installation in your path the link
might fail.

```
$ make
$ cp ../glvis/lib/libglvis.js .
```


## Known Issues

* The Library only supports glvis stream data
* Reloading data results in warns in the console
