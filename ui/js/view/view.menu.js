/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine menu module
define(['exports'], function (menu) {

  'use strict';


  // PRIVATE UTILITY FUNCTIONS

  /**
   * @param {Backbone.View} menuView
   * @returns {jQuery}
   */
  function getCurrentButton (menuView) {
    return menuView.$el.find('button.selected');
  }


  /**
   * @param {Backbone.View} menuView
   * @param {string} nextOrPrev Must be "next" or "prev"
   */
  function focusNextOrPreviousButton (menuView, nextOrPrev) {
    var currentBtn = getCurrentButton(menuView);
    var parentLi = currentBtn.parent('li');
    //TODO: Find a faster way to select the next or previous button.
    var nextOrPrevBtn = parentLi[nextOrPrev]().find('button');

    if (nextOrPrevBtn.length) {
      nextOrPrevBtn.focus();
    } else {
      var parentUl = parentLi.parent();

      var targetBtn;
      if (nextOrPrev === 'next') {
        targetBtn = parentUl.find('button:first');
      } else {
        targetBtn = parentUl.find('button:last');
      }

      targetBtn.focus();
    }
  }


  /**
   * @param {Backbone.View} menuView
   * @return {number}
   */
  function getLengthOfButtonRows (menuView) {
    var menuWidth = menuView._$btnArray.outerWidth();
    var buttonWidth =  menuView.$el.find('.btn:first')
        .outerWidth(true);

    return Math.floor(menuWidth / buttonWidth);
  }


  /**
   * @param {Backbone.View} menuView
   * @return {jQuery}
   */
  function getButtonList (menuView) {
    return menuView.$el.find('.menu-btn-array .btn');
  }


  /**
   * @param {jQuery} menuViewBtn The button child of a MenuView.
   * @return {number}
   */
  function getButtonIndex (menuViewBtn) {
    return menuViewBtn.parent('li').prevAll().length;
  }


  /**
   * @param {Backbone.View} menuView
   * @param {string} aboveOrBelow Must be "above" or "below"
   */
  function jumpRow (menuView, aboveOrBelow) {
    var btnRowLength = getLengthOfButtonRows(menuView);
    var btnList = getButtonList(menuView);
    var currentBtnIndex = getButtonIndex(getCurrentButton(menuView));
    var totalRows = Math.ceil(btnList.length / btnRowLength);
    var targetBtn, targetBtnIndex, cycledIndex;

    //TODO: This math works, but can probably be simplified quite a bit.
    if (aboveOrBelow === 'above') {
      targetBtnIndex = currentBtnIndex - btnRowLength;
      if (targetBtnIndex < 0) {
        cycledIndex = ((totalRows - 1) * btnRowLength) + currentBtnIndex;
        if (cycledIndex >= btnList.length) {
          cycledIndex -= btnRowLength;
        }
        targetBtnIndex = cycledIndex;
      }
    } else {
      targetBtnIndex = currentBtnIndex + btnRowLength;
      if (targetBtnIndex >= btnList.length) {
        targetBtnIndex = currentBtnIndex % btnRowLength;
      }
    }

    btnList.eq(targetBtnIndex).focus();
  }


  menu.view = Backbone.View.extend({

    'events': {
      'focus button': 'onButtonFocus'
      ,'blur button': 'onButtonBlur'
      ,'keydown button': 'onButtonKeydown'
    }


    /**
     * @param {Object} opts
     *   @param {Object} app
     *   @param {jQuery} $el
     */
    ,'initialize': function (opts) {
      _.extend(this, opts);

      /** @type {boolean} */
      this._isSelected = false;

      /** @type {jQuery} */
      this._$btnArray = this.$el.find('.menu-btn-array');

      subscribe(this.app.constants.message.MENU_SELECTED
        ,_.bind(this.onMenuItemSelected, this));
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onKeydown': function (evt) {
      var which = evt.which;
      if (which === this.app.constants.key.LEFT) {
        this.focusPreviousButton();
      } else if (which === this.app.constants.key.RIGHT) {
        this.focusNextButton();
      } else if (which === this.app.constants.key.UP) {
        this.focusAboveButton();
      } else if (which === this.app.constants.key.DOWN) {
        this.focusBelowButton();
      }
    }


    /**
     * @param {jQuery} menuItem
     */
    ,'onMenuItemSelected': function (menuItem) {
      if (menuItem === this.$el && !this._isSelected) {
        this.activate();
      } else {
        this._isSelected = false;
      }
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onButtonFocus': function (evt) {
      $(evt.target).addClass('selected');
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onButtonBlur': function (evt) {
      $(evt.target).removeClass('selected');
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onButtonKeydown': function (evt) {
      if (evt.which === this.app.constants.key.TAB) {
        evt.preventDefault();
      }
    }


    ,'activate': function () {
      // TODO: This is an inefficient check, but _isSelected wasn't working.
      // Try to fix this.
      if (this.$el.find('button.selected').length === 0) {
        this._isSelected = true;
        this.$el.find('button:first').focus();
        this.app.util.keyRouter.resetHandlers();
        this.app.util.keyRouter.route(
            KeyRouter.KEYDOWN, _.bind(this.onKeydown, this));

        publish(this.app.constants.message.MENU_SELECTED, [this.$el]);
      }
    }


    ,'focusNextButton': function () {
      focusNextOrPreviousButton(this, 'next');
    }


    ,'focusPreviousButton': function () {
      focusNextOrPreviousButton(this, 'prev');
    }


    ,'focusAboveButton': function () {
      jumpRow(this, 'above');
    }


    ,'focusBelowButton': function () {
      jumpRow(this, 'below');
    }

  });

});
