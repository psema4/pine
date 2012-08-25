/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
;(function (global) {

  'use strict';

  var pine = global.pine = (global.pine || {});
  pine.env = {
    'isSandboxed': !(global.parent.location === global.location)
  };

} (this));
