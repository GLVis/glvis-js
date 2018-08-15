import ipywidgets as widgets
from traitlets import Unicode, CFloat

@widgets.register
class GlvisWidget(widgets.DOMWidget):
    _view_name = Unicode('GlvisView').tag(sync=True)
    _model_name = Unicode('GlvisModel').tag(sync=True)
    _view_module = Unicode('jupyter-glvis-widget').tag(sync=True)
    _model_module = Unicode('jupyter-glvis-widget').tag(sync=True)
    _view_module_version = Unicode('0.1.0').tag(sync=True)
    _model_module_version = Unicode('0.1.0').tag(sync=True)
    data_str = Unicode().tag(sync=True)
    data_type = Unicode().tag(sync=True)

    def __init__(self, vis_str, *args, **kwargs):
        widgets.DOMWidget.__init__(self, *args, **kwargs)
        self.data_type = vis_str[0:vis_str.find('\n')]
        self.data_str = vis_str[vis_str.find('\n') + 1:]
