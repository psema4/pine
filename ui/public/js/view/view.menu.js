/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

// Pine menu module
define(['exports'], function (menu) {

  'use strict';


  // PRIVATE UTILITIES

  var $win = $(window);

  /**
   * @param {Backbone.View} menuView
   * @returns {jQuery}
   */
  function getCurrentButton (menuView) {
    return menuView.$el.find('button.selected');
  }


  /**
   * @param {Backbone.View} menuView
   * @param {jQuery} targetBtn
   */
  function focusTargetButton (menuView, targetBtn) {
    // This function is completely insane.  I'm sorry.
    var targetBtnTop = targetBtn.offset().top;
    var targetBtnBottom = targetBtnTop + targetBtn.outerHeight(true);
    var menuViewTop = menuView._$containingRail.offset().top;
    var menuViewBottom = menuViewTop +
        menuView._$containingRail.outerHeight(true);
    var isBtnAbove = targetBtnTop < menuViewTop;
    var isBtnBelow = targetBtnBottom > menuViewBottom;
    var targetBtnNegativeTop = -targetBtn.position().top;

    if (isBtnAbove) {
      menuView._$btnArray.css('top', targetBtnNegativeTop);
    } else if (isBtnBelow) {
      menuView._$btnArray.css('top', targetBtnNegativeTop +
          menuView._$containingRail.height() -
          targetBtn.parent().outerHeight(true));
    }

    targetBtn.focus();
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
    var targetBtn;

    if (nextOrPrevBtn.length) {
      targetBtn = nextOrPrevBtn;
    } else {
      var parentUl = parentLi.parent();

      if (nextOrPrev === 'next') {
        targetBtn = parentUl.find('button:first');
      } else {
        targetBtn = parentUl.find('button:last');
      }
    }

    focusTargetButton(menuView, targetBtn);
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
   */
  function getMaximumViewportSpace (menuView) {
    var top = menuView._$containingRail.offset().top;
    var bottom = $win.height();
    return bottom - top;
  }


  /**
   * @param {Backbone.View} menuView
   */
  function fitMenuToScreen (menuView) {
    menuView.$el.height(getMaximumViewportSpace(menuView));
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

    var targetBtn = btnList.eq(targetBtnIndex);
    focusTargetButton(menuView, targetBtn);
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

      // TODO: This View should NOT be concerned with the .menu-pager element.
      // This is a huge architectural flaw and the relationship between DOM
      // elements needs to rethought.  Get rid of this property and anything
      // that uses it.
      /** @type {jQuery} */
      this._$containingRail = this.$el.parents('.menu-pager');

      fitMenuToScreen(this);
      $win.on('resize', _.bind(fitMenuToScreen, null, this));

      subscribe(this.app.constants.message.MENU_SELECTED
        ,_.bind(this.onMenuItemSelected, this));
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onKeydown': function (evt) {
      var which = evt.which;
      if (which === this.app.constants.key.LEFT
          || which === this.app.constants.key.H) {
        this.focusPreviousButton();
      } else if (which === this.app.constants.key.RIGHT
          || which === this.app.constants.key.L) {
        this.focusNextButton();
      } else if (which === this.app.constants.key.UP
          || which === this.app.constants.key.K) {
        this.focusAboveButton();
      } else if (which === this.app.constants.key.DOWN
          || which === this.app.constants.key.J) {
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


    ,'getViewportHeight': function () {
      var children = this._$btnArray.children();
      var viewportSpace = getMaximumViewportSpace(this);

      var currentChild, childHeight, i = children.length - 1;
      for (i; i > 0; i--) {
        currentChild = children.eq(i);
        childHeight = currentChild.outerHeight(true);
        var childBottom = currentChild.position().top + childHeight;
        if (childBottom <= viewportSpace) {
          break;
        }
      }

      return Math.min(childBottom, viewportSpace);
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


    ,'resetPosition': function () {
      this._$btnArray.css('top', 0);
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


    ,'clickCurrentButton': function () {
      getCurrentButton(this).click();
    }

  });

});
