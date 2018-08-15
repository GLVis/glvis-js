glvis-widget
===============================

A Jupyter Widget for the finite element visualization application [GLVis](http://glvis.org/).

Built using the [widget-cookiecutter](https://github.com/jupyter-widgets/widget-cookiecutter)

Installation
------------

To install use pip:

    $ pip install glvis_widget
    $ jupyter nbextension enable --py --sys-prefix glvis_widget


For a development installation (requires npm),

    $ git clone https://github.com/glvis/glvis-widget.git
    $ cd glvis-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix glvis_widget
    $ jupyter nbextension enable --py --sys-prefix glvis_widget


