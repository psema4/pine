;(function (global, pine) {
  var input = global.input = new pine.Input();
  var docEl = document.documentElement;

  // Set up event listeners if we are running the game directly (not via the
  // Pine interface).
  if (!pine.env.isSandboxed) {
    ['keydown', 'keyup'].forEach(function (eventName) {
      docEl.addEventListener(eventName, function (evt) {
        input[eventName](evt.which);
      });
    });
  }


  var keyHandlers = {
    keydown: []
    ,keyup: []
  };


  input.onKeydown(function (keycode) {
    var i, length = keyHandlers.keydown.length;
    for (i = 0; i < length; i++) {
      var handler = keyHandlers.keydown[i];
      if (keycode === handler.keycode) {
        handler.fn();
        return;
      }
    }
  });


  input.onKeyup(function (keycode) {
    var i, length = keyHandlers.keyup.length;
    for (i = 0; i < length; i++) {
      var handler = keyHandlers.keyup[i];
      if (keycode === handler.keycode) {
        handler.fn();
        return;
      }
    }
  });


  var dts = docEl.querySelectorAll('#key-list dt');
  var dtArr = Array.prototype.slice.call(dts, 0);

  dtArr.forEach(function (dt) {
    var isPressed = false;
    var dd = dt.nextElementSibling;
    dd.textContent = 'Not pressed';
    var dtKeycode = +dt.dataset.keycode;

    var keydownHandlerObject = {};
    keydownHandlerObject.keycode = dtKeycode;
    keydownHandlerObject.fn = function () {
      if (!isPressed) {
        dd.textContent = 'Pressed';
      }
      isPressed = true;
    };
    keyHandlers.keydown.push(keydownHandlerObject)

    var keyupHandlerObject = {};
    keyupHandlerObject.keycode = dtKeycode;
    keyupHandlerObject.fn = function () {
      if (isPressed) {
        dd.textContent = 'Not pressed';
      }
      isPressed = false;
    };
    keyHandlers.keyup.push(keyupHandlerObject)
  });
} (this, this.pine));
