/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine Gamepad API module
;(function (global) {

  'use strict';

  var pine = global.pine = (global.pine || {});
  pine.gamepad = {
    'downKeys': {}
  };
  var downKeys, gamepads;

  function tick () {

    global.webkitRequestAnimationFrame(tick);
    pine.gamepad.downKeys = downKeys = {};
    gamepads = navigator.webkitGetGamepads();

    var len = gamepads.length, buttonsLength, i, j, gamepad, map, id;
    for (i = 0; i < len; i++) {
      gamepad = gamepads[i];

      if (!gamepad) {
        continue;
      }

      // Some controller id strings prepend an invisible unicode character -
      // slice it out if it is present.
      id = gamepad.id.charCodeAt(0) === 65279
          ? gamepad.id.slice(1)
          : gamepad.id;

      map = gamepadMap[id];
      buttonsLength = gamepad.buttons.length;

      if (map) {
        for (j = 0; j < buttonsLength; j++) {
          if (gamepad.buttons[j] && map[j]) {
            downKeys[map[j]] = true;
          }
        }
      }
    }
  }

  global.webkitRequestAnimationFrame(tick);

  var gamepadMap = {
    'Logitech RumblePad 2 USB (STANDARD GAMEPAD Vendor: 046d Product: c218)': {
      '0': 'B'
      ,'1': 'A'
      ,'2': 'Y'
      ,'3': 'X'
      ,'4': 'L1'
      ,'5': 'R1'
      ,'6': 'L2'
      ,'7': 'R2'
      ,'8': 'SELECT'
      ,'9': 'START'
      ,'10': 'L3'
      ,'11': 'R3'
      ,'12': 'UP'
      ,'13': 'DOWN'
      ,'14': 'LEFT'
      ,'15': 'RIGHT'
    }
  };

} (this));
