// Library for routing DOM element key events to handlers.
// Optimized for HTML 5 browsers.
;(function (global) {

  'use strict';

  function noop () {}

  var INTERNAL_HANDLER_NAME_MAP = {
    'keyup': '_keyUpHandler'
    ,'keydown': '_keyDownHandler'
    ,'keypress': '_keyPressHandler'
  };

  // API:
  //   var keyRouter = new KeyRouter(document.documentElement);
  //
  //   keyRouter.route(KeyRouter.KEYDOWN, function (evt) {
  //
  //   });

  /**
   * @param {HTMLElement} root The root element to listen to.
   * @constructor
   */
  var KeyRouter = global.KeyRouter = function (root) {
    this._root = root;
    this[INTERNAL_HANDLER_NAME_MAP.keyup] = noop;
    this[INTERNAL_HANDLER_NAME_MAP.keydown] = noop;
    this[INTERNAL_HANDLER_NAME_MAP.keypress] = noop;

    this._root.addEventListener(KeyRouter.KEYUP,
        this[INTERNAL_HANDLER_NAME_MAP.keyup], false);
    this._root.addEventListener(KeyRouter.KEYDOWN,
        this[INTERNAL_HANDLER_NAME_MAP.keydown], false);
    this._root.addEventListener(KeyRouter.KEYPRESS,
        this[INTERNAL_HANDLER_NAME_MAP.keypress], false);
  };


  KeyRouter.KEYUP = 'keyup';
  KeyRouter.KEYDOWN = 'keydown';
  KeyRouter.KEYPRESS = 'keypress';


  KeyRouter.prototype.resetHandlers = function () {
    var self = this;
    [KeyRouter.KEYUP, KeyRouter.KEYDOWN, KeyRouter.KEYPRESS].forEach(
        function (eventName) {
      self.route(eventName, noop);
    });
  };


  /**
   * @param {string} eventName The name of the event to route.
   * @param {Function} handler The handler to receive the event.
   */
  KeyRouter.prototype.route = function (eventName, handler) {
    var oldHandler = this._getHandlerForEventName(eventName);
    this._root.removeEventListener(eventName, oldHandler, false);
    this[INTERNAL_HANDLER_NAME_MAP[eventName]] = handler;
    this._root.addEventListener(eventName, handler, false);
  };


  /**
   * @param {string} eventName
   * @return {?Function}
   */
  KeyRouter.prototype._getHandlerForEventName = function (eventName) {
    var handler = this[INTERNAL_HANDLER_NAME_MAP[eventName]];

    if (!handler) {
      throw 'KeyRouter:  Invalid eventName';
    }

    return handler;
  };

} (this));
