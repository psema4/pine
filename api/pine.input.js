/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
;(function (global) {

  'use strict';

  var pine = global.pine = (global.pine || {});
  function noop () {}

  // API:
  //   var input = new pine.Input();
  //
  //   input.onKeydown(function (keycode) {
  //     console.log(keycode);
  //   });
  //   input.onKeyup(function (keycode) {
  //     console.log(keycode);
  //   });
  //
  //   input.keydown(36);
  //   input.keyup(37);
  pine.Input = function () {
    /** @type {function} */
    this._onKeydownHandler = noop;

    /** @type {function} */
    this._onKeyupHandler = noop;
  };


  /**
   * @param {function(number)} handler
   */
  pine.Input.prototype.onKeydown = function (handler) {
    this._onKeydownHandler = handler;
  };


  /**
   * @param {function(number)} handler
   */
  pine.Input.prototype.onKeyup = function (handler) {
    this._onKeyupHandler = handler;
  };


  /**
   * @param {number} keycode
   */
  pine.Input.prototype.keydown = function (keycode) {
    this._onKeydownHandler(keycode);
  }


  /**
   * @param {number} keycode
   */
  pine.Input.prototype.keyup = function (keycode) {
    this._onKeyupHandler(keycode);
  }

} (this));
