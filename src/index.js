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
    root["glvis"] = factory(root["glvis"]);
  }
})(this, function (glvis) {
  function display(div, canvas, data_type, data_str) {
    glvis().then(
      function (g) {
        g.setKeyboardListeningElementId(div.id);
        g.canvas = canvas;
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

  function displayStream(div, canvas, stream) {
    var index = stream.indexOf("\n");
    var data_type = stream.substr(0, index);
    var data_str = stream.substr(index + 1);
    display(div, canvas, data_type, data_str);
  }

  function loadStream(e, div, canvas) {
    var reader = new FileReader();
    var filename = e.target.files[0];
    reader.onload = function (e) {
      console.log("loading " + filename);
      displayStream(div, canvas, e.target.result);
    };
    reader.readAsText(filename);
  }

  function setupCanvas(div, width = 640, height = 480) {
    var canvas = document.createElement("canvas");
    canvas.id = "glvis-canvas";
    canvas.width = width;
    canvas.height = height;
    // doesn't work anymore?
    // canvas.oncontextmenu = "return false;";
    canvas.oncontextmenu = function (e) {
      e.preventDefault();
    };
    canvas.innerHTML = "Your browser doesn't support HTML canvas";
    canvas.addEventListener("click", function () {
      div.focus();
      return true;
    });
    div.append(canvas);
    return canvas;
  }

  return {
    setupCanvas: setupCanvas,
    displayStream: displayStream,
    loadStream: loadStream,
    display: display,
    glvis: glvis,
    info: function () {
      console.log("hi from GLVis!");
    },
  };
});
