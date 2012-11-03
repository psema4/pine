/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

require([

    'public/js/app'

    // Views

    ,'public/js/view/view.menu'
    ,'public/js/view/view.menu-pager'
    ,'public/js/view/view.game-init'

    ], function (

    app

    ,menu
    ,menuPager
    ,gameInit) {

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

  var $mainMenus = $('#main-menus');
  app.view.mainMenuPager = new menuPager.view({
    'app': app
    ,'$el': $mainMenus
    ,'menuViews': menuViews
  });

  var $pineContainer = $('#pine-container');
  var $gameContainer = $('#game-container');
  app.view.gameInit = new gameInit.view({
    'app': app
    ,'$el': $pineContainer
    ,'$gameContainer': $gameContainer
  });

  console.log(app);

  $(function () {
    $('body').addClass('loaded');
  });

});
