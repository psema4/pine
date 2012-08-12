/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine app map module
define(['js/constants'], function (constants) {

  'use strict';

  // Serves as a map of initialized app components
  var app = {
    'constants': constants
    ,'view': {
      'mainMenuPager': null
    }
    ,'util': {}
  };

  return app;

});
