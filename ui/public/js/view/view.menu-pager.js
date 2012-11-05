/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine menu pager module
define(['exports'], function (menuPager) {

  'use strict';

  var $win = $(window);


  /**
   * @param {Backbone.View} menuPager
   */
  function recalulateHeight (menuPager) {
    var windowWidth = $win.width();
    menuPager.$el.width(windowWidth);
    menuPager._$rail.width(windowWidth * menuPager.menuViews.length);

    var maxMenuHeight = 0;
    menuPager.menuViews.forEach(function (menuView) {
      maxMenuHeight = Math.max(menuView.getViewportHeight(), maxMenuHeight);
    });

    menuPager.$el.height(maxMenuHeight);
  }


  /**
   * @param {Backbone.View} menuPager
   */
  function gamepadTick (menuPager) {
    setTimeout(function () {
      gamepadTick(menuPager);
    }, 100);

    var menuView = menuPager.getCurrentMenu();
    var key, downKeys = pine.gamepad.downKeys;
    for (key in downKeys) {
      if (downKeys.hasOwnProperty(key)) {
        switch (key) {
          case 'LEFT':
            menuView.focusPreviousButton();
            break;
          case 'RIGHT':
            menuView.focusNextButton();
            break;
          case 'UP':
            menuView.focusAboveButton();
            break;
          case 'DOWN':
            menuView.focusBelowButton();
            break;
          case 'L1':
          case 'L2':
            menuPager.activatePreviousMenu();
            break;
          case 'R1':
          case 'R2':
            menuPager.activateNextMenu();
            break;
          case 'B':
            menuView.clickCurrentButton();
            break;
        }
      }
    }
  }

  menuPager.view = Backbone.View.extend({

    'events': {
      'keydown': 'onKeydown'
    }


    /**
     * @param {Object} opts
     *   @param {Object} app
     *   @param {jQuery} $el
     *   @param {Array.<MenuView>} menuViews Must have at least one menuView.
     */
    ,'initialize': function (opts) {
      _.extend(this, opts);

      /** @type {number} */
      this._currentMenuIndex = 0;

      /** @type {jQuery} */
      this._$rail = this.$el.find('.menu-pager-rail');

      recalulateHeight(this);
      $win.on('resize', _.bind(recalulateHeight, null, this));
      this.activateMenu(0);

      gamepadTick(this);
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onKeydown': function (evt) {
      var which = evt.which;
      if (which === this.app.constants.key.E) {
        this.activateNextMenu();
      } else if (which === this.app.constants.key.W) {
        this.activatePreviousMenu();
      }
    }


    /**
     * @param {number} index
     */
    ,'activateMenu': function (index) {
      index = Math.max(index, 0);
      index = Math.min(index, this.menuViews.length - 1);
      var targetMenu = this.menuViews[index];
      targetMenu.resetPosition();
      this._currentMenuIndex = index;

      // The logic gets a little tricky here because an animation may not be
      // occurring - meaning that the element is moving to the position that it
      // is already in.
      var targetLeft = -targetMenu.$el.position().left;
      if (targetLeft === parseInt(this._$rail.css('left'), 10)) {
        // No animation occurred, just execute the callback.
        targetMenu.activate();
      } else {
        this._$rail
          .css('left', targetLeft)
          .off('webkitTransitionEnd')
          // Need to use $.fn.one here because multiple webkitTransitionEnd
          // events fire on the _$rail element.
          // TODO: Figure out why that happens...
          .one('webkitTransitionEnd',
              _.bind(targetMenu.activate, targetMenu));
      }
    }


    ,'activatePreviousMenu': function () {
      this.activateMenu(this._currentMenuIndex - 1);
    }


    ,'activateNextMenu': function () {
      this.activateMenu(this._currentMenuIndex + 1);
    }


    ,'getCurrentMenu': function () {
      return this.menuViews[this._currentMenuIndex];
    }


    ,'reactivateCurrentMenu': function () {
      this.activateMenu(this._currentMenuIndex);
    }

  });

});
