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
  const w = window.innerWidth;
  const h = window.innerHeight;
  return [w, h];
}
