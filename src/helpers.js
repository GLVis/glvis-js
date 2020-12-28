function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

function toggleFullscreen() {
  if (document.fullscreenEnabled) {
    var elem = document.documentElement;
    if (document.fullscreenElement === null) {
      openFullscreen(elem);
    } else {
      closeFullscreen(elem);
    }
  } else {
    console.warn("full screen not allowed");
  }
}

function windowDim() {
  const cw = document.documentElement.clientWidth;
  const iw = window.innerWidth;
  const w = cw & iw ? Math.min(cw, iw) : cw | iw;
  const ch = document.documentElement.clientHeight;
  const ih = window.innerHeight;
  const h = ch & ih ? Math.min(ch, ih) : ch | ih;
  return [w, h];
}

function augmentLoggers(log_id, log_cont_id) {
  var log = document.getElementById(log_id);
  var log_cont = document.getElementById(log_cont_id);

  function augmentLogger(name) {
    var out = console[name];

    function to_text(args) {
      return args.reduce(function (current, next) {
        return (
          current +
          `<span class="log-${name}">` +
          (typeof next === "object" ? JSON.stringify(next) : next) +
          "</span>&nbsp;"
        );
      }, "");
    }

    console[name] = function (...arguments) {
      out(...arguments);
      log.innerHTML += to_text(arguments) + "<br>";
      log_cont.scrollTop = log_cont.scrollHeight; // - log_cont.clientHeight;
    };
  }

  ["log", "warn", "error", "info", "debug"].forEach((n) => {
    augmentLogger(n);
  });
}
