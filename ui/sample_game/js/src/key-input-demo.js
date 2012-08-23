;(function (global) {
  var input = global.input = new global.pine.Input();

  // Set up event listeners if we are running the game directly (not via the
  // Pine interface).
  if (!global.isSandboxed) {
    $(global).on({
      'keydown': function (evt) {
        input.keydown(evt.which);
      }
      ,'keyup': function (evt) {
        input.keyup(evt.which);
      }
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


  $('#key-list dt').each(function (i, dt) {
    var $dt = $(dt);
    var $dd = $dt.next();
    $dd.text('Not pressed');
    var dtKeycode = $dt.data('keycode');

    var keydownHandlerObject = {};
    keydownHandlerObject.keycode = dtKeycode;
    keydownHandlerObject.fn = function () {
      $dd.text('Pressed');
    };
    keyHandlers.keydown.push(keydownHandlerObject)

    var keyupHandlerObject = {};
    keyupHandlerObject.keycode = dtKeycode;
    keyupHandlerObject.fn = function () {
      $dd.text('Not pressed');
    };
    keyHandlers.keyup.push(keyupHandlerObject)
  });
} (this));
