var jupyter-glvis-widget = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'jupyter-glvis-widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'jupyter-glvis-widget',
          version: jupyter-glvis-widget.version,
          exports: jupyter-glvis-widget
      });
  },
  autoStart: true
};

