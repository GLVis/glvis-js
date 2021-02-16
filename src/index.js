// Copyright (c) 2010-2021, Lawrence Livermore National Security, LLC. Produced
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
  function rand_id() {
    const arr = new Uint8Array(10);
    window.crypto.getRandomValues(arr);
    return arr.reduce(
      (cur, next) => cur + next.toString(36).padStart(2, "0"),
      ""
    );
  }

  class State {
    constructor(div, width = 640, height = 480, canvas = undefined) {
      if (div === undefined) {
        throw "div cannot be undefined";
      }
      this.div_ = div;
      this.canvas_ = canvas;
      this.emglv_ = emglvis();
      this.emsetup_ = false;
      this.setupCanvas(width, height);
      this.new_stream_callbacks = [];
      // could also have an update_stream_callbacks
      // this.update_stream_callbacks = [];
    }

    setCanvasSize(width, height) {
      const pixel_ratio = window.devicePixelRatio || 1;
      this.canvas_.style.width = `${width}px`;
      this.canvas_.style.height = `${height}px`;
      this.canvas_.width = Math.floor(width * pixel_ratio);
      this.canvas_.height = Math.floor(height * pixel_ratio);
      console.log(
        `dpr=${pixel_ratio} new canvas sizes: ` +
          `style.width=${this.canvas_.style.width}, ` +
          `style.height=${this.canvas_.style.height}, ` +
          `width=${this.canvas_.width}, ` +
          `height=${this.canvas_.height}`
      );
    }

    async setSize(width, height) {
      this.setCanvasSize(width, height);
      var g = await this.emglv_;
      g.resizeWindow(width, height);
      g.sendExposeEvent();
    }

    setupCanvas(width, height) {
      if (this.canvas_ === undefined) {
        this.canvas_ = document.createElement("canvas");
        this.canvas_.id = `glvis-canvas-${rand_id()}`;
      }
      this.setCanvasSize(width, height);
      this.canvas_.innerHTML = "Your browser doesn't support HTML canvas";

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

    // only callable from resolved emglvis
    _setupEmGlvis(g) {
      if (this.emsetup_) {
        return;
      }
      g.setKeyboardListeningElementId(this.div_.id);
      g.setCanvasId(this.canvas_.id);
      g.canvas = this.canvas_;
    }

    // only callable from resolved emglvis
    _startVis(g) {
      if (this.emsetup_) {
        return;
      }
      this.emsetup_ = true;
      console.log("starting visualization loop");
      // needed again here... do we delete the SdlWindow somewhere in startVisualization?
      g.setCanvasId(this.canvas_.id);
      function iterVis(timestamp) {
        g.iterVisualization();
        window.requestAnimationFrame(iterVis);
      }
      window.requestAnimationFrame(iterVis);
    }

    async display(data_type, data_str) {
      var g = await this.emglv_;
      this._setupEmGlvis(g);
      g.startVisualization(
        data_str,
        data_type,
        this.canvas_.width,
        this.canvas_.height
      );
      this.new_stream_callbacks.forEach((f) => f(this));
      this._startVis(g);
    }

    async displayStream(stream) {
      const index = stream.indexOf("\n");
      const data_type = stream.substr(0, index);
      const data_str = stream.substr(index + 1);
      await this.display(data_type, data_str);
    }

    async update(data_type, data_str) {
      if (!this.emsetup_) {
        this.display(data_type, data_str);
        return;
      }
      var g = await this.emglv_;
      if (g.updateVisualization(data_type, data_str) != 0) {
        console.log("unable to update stream, starting a new one");
        this.display(data_type, data_str);
      }
    }

    async updateStream(stream) {
      const index = stream.indexOf("\n");
      const data_type = stream.substr(0, index);
      const data_str = stream.substr(index + 1);
      await this.update(data_type, data_str);
    }

    async sendKey(key, ctrl = false, shift = false, alt = false) {
      var key_code = undefined;
      if (typeof key === "string") {
        key_code = key.charCodeAt(0);
        console.log(`sending key '${key[0]}' (key_code=${key_code})`);
      } else if (typeof key === "number") {
        key_code = key;
        console.log(`sending key_code=${key_code}`);
      } else {
        throw "unsupported type";
      }
      var g = await this.emglv_;
      g.processKey(key_code, ctrl, shift, alt);
    }

    async sendKeyStr(keys) {
      var g = await this.emglv_;
      g.processKeys(keys);
    }

    async loadUrl(url) {
      var resp = await fetch(url);
      if (!resp.ok) {
        alert(`${url} doesn't exist`);
        return;
      }
      var text = await resp.text();
      if (text == "") {
        alert(`${url} has no content`);
        return;
      }
      console.log(`loading ${url}`);
      await this.displayStream(text);
    }

    async loadStream(e) {
      const filename = e.target.files[0];
      const data = await new Response(filename).text();
      await this.displayStream(data);
    }

    setTouchDevice(status) {
      // TODO TMS
      //this.emglv_.then((g) => { g.setTouchDevice(status); });
    }

    async getHelpString() {
      var g = await this.emglv_;
      return g.getHelpString();
    }

    // callbacks: f(State) -> void
    registerNewStreamCallback(f) {
      this.new_stream_callbacks.push(f);
    }
  }

  return {
    emglvis: emglvis,
    State: State,
    info: function () {
      console.log("hi from GLVis!");
    },
    rand_id: rand_id,
  };
});
