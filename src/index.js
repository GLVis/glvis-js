// Copyright (c) 2010-2020, Lawrence Livermore National Security, LLC. Produced
// at the Lawrence Livermore National Laboratory. All Rights reserved. See files
// LICENSE and NOTICE for details. LLNL-CODE-443271.
//
// This file is part of the GLVis visualization tool and library. For more
// information and source code availability see https://glvis.org.
//
// GLVis is free software; you can redistribute it and/or modify it under the
// terms of the BSD-3 license. We welcome feedback and contributions, see file
// CONTRIBUTING.md for details.

// got this from the webpack docs
// https://webpack.js.org/configuration/output/
(function webpackUniversalModuleDefinition(root, factory) {
  // node
  if (typeof exports === "object" && typeof module === "object") {
    console.log("mod type 1");
    module.exports = factory(require("./glvis"));
  }
  // requirejs?
  else if (typeof define === "function" && define.amd) {
    console.log("mod type 2");
    define(["./glvis"], factory);
  }
  // unknown
  else if (typeof exports === "object") {
    console.warn("glvis: untested module load");
    exports["someLibName"] = factory(require("./glvis"));
  }
  // browser global
  else {
    root["glvis"] = factory(root["glvis"]);
  }
})(this, function (emglvis) {
  class State {
    constructor(div, width = 640, height = 480, canvas = undefined) {
      if (div === undefined) {
        throw "div cannot be undefined";
      }
      this.width_ = width;
      this.height_ = height;
      this.div_ = div;
      this.canvas_ = canvas;
      this.emglv_ = emglvis();
      this.emsetup_ = false;
      this.setupCanvas();
    }

    setSize(width, height) {
      this.width_ = width;
      this.height_ = height;
      if (this.canvas_ !== undefined) {
        this.canvas_.width = width;
        this.canvas_.height = height;
        this.emglv_.then(function (g) {
          g.resizeWindow(width, height);
          g.sendExposeEvent();
        });
      }
    }

    setupCanvas() {
      if (this.canvas_ === undefined) {
        this.canvas_ = document.createElement("canvas");
        this.canvas_.id = "glvis-canvas";
      }
      this.canvas_.width = this.width_;
      this.canvas_.height = this.height_;
      this.canvas_.innerHTML = "Your browser doesn't support HTML canvas";
      //this.canvas_.style = "outline: 0";

      this.canvas_.oncontextmenu = function (e) {
        e.preventDefault();
      };
      var that = this;
      this.canvas_.addEventListener("click", function () {
        that.div_.focus();
        return true;
      });

      this.div_.append(this.canvas_);
    }

    // only to be called from glvis.then
    _setupEmGlvis(g) {
      if (this.emsetup_) {
        return;
      }
      g.setKeyboardListeningElementId(this.div_.id);
      g.canvas = this.canvas_;
    }

    // only to be called from glvis.then
    _startVis(g) {
      if (this.emsetup_) {
        return;
      }
      console.log("starting visualization loop");
      function iterVis(timestamp) {
        g.iterVisualization();
        window.requestAnimationFrame(iterVis);
      }
      window.requestAnimationFrame(iterVis);
    }

    display(data_type, data_str) {
      var that = this;
      this.emglv_.then(function (g) {
        that._setupEmGlvis(g);

        g.startVisualization(
          data_str,
          data_type,
          that.canvas_.width,
          that.canvas_.height
        );

        that._startVis(g);
        that.emsetup_ = true;
      });
    }

    displayStream(stream) {
      const index = stream.indexOf("\n");
      const data_type = stream.substr(0, index);
      const data_str = stream.substr(index + 1);
      this.display(data_type, data_str);
    }

    sendKey(key) {
      if (this.canvas_ !== undefined) {
        var e = new KeyboardEvent("keypress", {
          bubbles: true,
          charCode: key.charCodeAt(0),
        });
        this.canvas_.dispatchEvent(e);
      }
    }
  }

  function loadStream(e, state) {
    var reader = new FileReader();
    var filename = e.target.files[0];
    reader.onload = function (e) {
      console.log("loading " + filename);
      state.displayStream(e.target.result);
    };
    reader.readAsText(filename);
  }

  return {
    loadStream: loadStream,
    emglvis: glvis,
    State: State,
    info: function () {
      console.log("hi from GLVis!");
    },
  };
});
