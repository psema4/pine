;(function (global, pine) {
  var gamepadButtonDts = document.querySelectorAll('#gamepad-button-list dt');
  var dtsArray = Array.prototype.slice.call(gamepadButtonDts, 0);

  (function tick () {
    global.webkitRequestAnimationFrame(tick);

    dtsArray.forEach(function (buttonDt) {
      buttonDt.nextElementSibling.textContent =
        (buttonDt.dataset.buttonname in pine.gamepad.downKeys)
        ? 'Down'
        : 'Up';
    });
  }());

} (this, this.pine));
