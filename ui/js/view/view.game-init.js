/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine game initialization module
define(['exports'], function (gameInit) {

  'use strict';


  gameInit.view = Backbone.View.extend({

    'events': {
      'click .game-init': 'onClickGameInit'
    }


    /**
     * @param {Object} opts
     *   @param {Object} app
     *   @param {jQuery} $el
     */
    ,'initialize': function (opts) {
      _.extend(this, opts);
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onClickGameInit': function (evt) {
      var $target = $(evt.target);
      var url = $target.data('game-url');
      window.location = url;
    }

  });

});
