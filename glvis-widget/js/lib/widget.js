var widgets = require('@jupyter-widgets/base');
var glvis = require('./libglvis');
var _ = require('lodash');

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916
function guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var GlvisModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'GlvisModel',
        _view_name : 'GlvisView',
        _model_module : 'jupyter-glvis-widget',
        _view_module : 'jupyter-glvis-widget',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        data_str : '',
        data_type : ''

    })
});

var GlvisView = widgets.DOMWidgetView.extend({
    render: function() {
        var div_wrapper = document.createElement('div');
        let div_id = guid();
        div_wrapper.setAttribute('id', div_id);
        div_wrapper.setAttribute('tabindex', '0');
        
        var canvas = document.createElement('canvas');
        //canvas.height = "300";
        //canvas.width = "400";
        canvas.setAttribute('oncontextmenu', 'return false;');
        // clicks focus on the div which is the keyboard target for SDL,
        // set with {glvis_instance}.setKeyboardListeningElementId
        canvas.addEventListener('click', function() {
            div_wrapper.focus();
            return true;
        });

        div_wrapper.append(canvas);
        this.el.append(div_wrapper);

        //this.model.on('change:data_str', this.display, this);

        var view = this;
        let g = new glvis().then(function() {
            g.setKeyboardListeningElementId(div_id);
            g.canvas = canvas;
            var data_type = view.model.get('data_type');
            var data_as_str = view.model.get('data_str');
            g.startVisualization(data_as_str, data_type);

            function vis_iteration(timestamp) {
                g.iterVisualization();
                window.requestAnimationFrame(vis_iteration);
            }
            window.requestAnimationFrame(vis_iteration);
        });
    },
    
    display: function() {            
        // pass for now
    }
});
        
module.exports = {
    GlvisModel : GlvisModel,
    GlvisView : GlvisView
};
