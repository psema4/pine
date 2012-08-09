/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

require([

    'js/app'

    // Views

    ,'js/view/view.menu'

    ], function (

    app
    ,menu) {

  'use strict';

  app.util.keyRouter = new KeyRouter(document.documentElement);
  var $menu = $('.menu');

  $menu.each(function (i, el) {
    app.view.menu.push(new menu.view({
      'el': $(el)
      ,'app': app
    }));
  });

  //publish(app.constants.message.MENU_SELECTED, [app.view.menu[0].$el]);
  app.view.menu[0].focus();

  console.log(app);

});
