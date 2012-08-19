/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine game initialization module
define(['exports'], function (gameInit) {

  'use strict';

  var $win = $(window);


  // PRIVATE UTILITY FUNCTIONS


  /**
   * @param {string} src
   * @param {jQuery} An iframe.
   */
  function buildiFrame (src) {
    var $iframe = $(document.createElement('iframe'));
    $iframe.attr('src', src);

    return $iframe;
  }


  gameInit.view = Backbone.View.extend({

    'events': {
      'click .game-init': 'onClickGameInit'
      ,'click #game-container.playing .input-proxy': 'onClickInputProxy'
      ,'keydown #game-container.playing .key-proxy': 'onProxiedKeydown'
      ,'keyup #game-container.playing .key-proxy': 'onProxiedKeyup'
    }


    /**
     * @param {Object} opts
     *   @param {Object} app
     *   @param {jQuery} $el
     */
    ,'initialize': function (opts) {
      _.extend(this, opts);

      /** @type {jQuery) */
      this._$gameContainer = this.$gameContainer;

      /** @type {jQuery) */
      this._$inputProxy = this._$gameContainer.find('.input-proxy');

      /** @type {jQuery) */
      this._$keyProxy = this._$inputProxy.find('.key-proxy');

      /** @type {jQuery} */
      this._$iframe = null;

      // This was made private, remove the public reference.
      delete this.$gameContainer;
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onClickGameInit': function (evt) {
      var $target = $(evt.target);
      this._$iframe = buildiFrame($target.data('game-url'));
      this._$gameContainer
        .prepend(this._$iframe)
        .addClass('playing');
      this._$keyProxy.focus();
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onClickInputProxy': function (evt) {
      this._$keyProxy.focus();
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onProxiedKeydown': function (evt) {
      var which = evt.which;
      if (which === this.app.constants.key.ESC) {
        this.exitGame();
      } else {
        window.frames[0].input.keydown(which);
      }
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onProxiedKeyup': function (evt) {
      window.frames[0].input.keyup(evt.which);
    }


    ,'exitGame': function () {
      this._$gameContainer
        .addClass('exiting')
        // The `exiting` class triggers a webkitAnimation, `one` effectively
        // acts as a callback.
        .one('webkitTransitionEnd', _.bind(function (evt) {
          this._$gameContainer.removeClass('playing exiting');
          this._$iframe.remove();
          this.app.view.mainMenuPager.reactivateCurrentMenu();
        }, this));
    }

  });

});
