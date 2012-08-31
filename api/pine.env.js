/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
;(function (global) {

  'use strict';

  var pine = global.pine = (global.pine || {});
  var env = pine.env = {};


  /** @type {boolean} */
  env.isDev =  (global.parent.location === global.location)


  pine.env.exit = function () {
    window.location = '/';
  };


  if (env.isDev) {
    document.documentElement.addEventListener('keydown', function (evt) {
      // TODO: Replace this with a constant
      if (evt.which === 27) { // esc
        pine.env.exit();
      }
    });
  }

} (this));
