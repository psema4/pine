/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

require([

    'js/app'

    // Views

    ,'js/view/view.menu'
    ,'js/view/view.menu-pager'

    ], function (

    app
    ,menu
    ,menuPager) {

  'use strict';

  app.util.keyRouter = new KeyRouter(document.documentElement);
  var $menu = $('.menu');

  var menuViews = [];
  $menu.each(function (i, el) {
    menuViews.push(new menu.view({
      'el': $(el)
      ,'app': app
    }));
  });

  app.view.mainMenuPager = new menuPager.view({
    'app': app
    ,'$el': $('#main-menus')
    ,'menuViews': menuViews
  });

  console.log(app);

  $(function () {
    $('body').addClass('loaded');
  });

});
