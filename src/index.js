// got this from the webpack docs
// https://webpack.js.org/configuration/output/
(function webpackUniversalModuleDefinition(root, factory) {
  // node
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory(require("./glvis"));
  }
  // browser
  else if (typeof define === "function" && define.amd) {
    define(["./glvis"], factory);
  } else if (typeof exports === "object") {
    console.warn("glvis: untested module load");
    exports["someLibName"] = factory(require("./glvis"));
  } else {
    console.warn("glvis: untested module load");
    root["someLibName"] = factory(root["_"]);
  }
})(this, function (glvis) {
  function display(div_id, canvas_id, data_type, data_str) {
    glvis().then(
      function (g) {
        g.setKeyboardListeningElementId(div_id);
        g.canvas = document.getElementById(canvas_id);
        g.startVisualization(
          data_str,
          data_type,
          g.canvas.width,
          g.canvas.height
        );

        function iterVis(timestamp) {
          g.iterVisualization();
          window.requestAnimationFrame(iterVis);
        }
        window.requestAnimationFrame(iterVis);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  function displayStream(div_id, canvas_id, stream) {
    var index = stream.indexOf("\n");
    var data_type = stream.substr(0, index);
    var data_str = stream.substr(index + 1);
    display(div_id, canvas_id, data_type, data_str);
  }

  function loadStream(e, div_id, canvas_id) {
    var reader = new FileReader();
    var filename = e.target.files[0];
    reader.onload = function (e) {
      console.log("loading " + filename);
      displayStream(div_id, canvas_id, e.target.result);
    };
    reader.readAsText(filename);
  }

  function setupCanvas(div_id, width, height) {
    var div = document.getElementById(div_id);
    var canvas = document.createElement("canvas");
    canvas.id = "glvis-canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.oncontextmenu = "return false;";
    canvas.innerHTML = "Your browser doesn't support HTML canvas";
    canvas.addEventListener("click", function () {
      div.focus();
      return true;
    });
    div.append(canvas);
    return canvas;
  }

  var mod = {
    setupCanvas: setupCanvas,
    displayStream: displayStream,
    loadStream: loadStream,
    display: display,
    glvis: glvis,
    info: function () {
      console.log("hi from GLVis!");
    },
  };

  return mod;
});
