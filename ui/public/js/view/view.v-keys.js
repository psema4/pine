/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

define(['exports', './../plugin/v-keys-helper', './../constants']
    ,function (vKeysView, vKeysHelper, constants) {

  'use strict';

  /** @type {jQuery} */
  var $docEl = $(document.documentElement);

  /** @type {jQuery} */
  var $body = $('body');

  /**
   * @type {{
   *   x: number,
   *   y: number
   * }}
   */
  var Coordinate;

  /** @type {string} */
  var DEFAULT_LAYOUT = 'uppercase';

  /** @type {string} */
  var SELECTED_TD_CLASS = 'pine-keyboard-selected-key';


  /**
   * @param {jQuery} $el
   * @return {number}
   */
  function getElementIndex($el) {
    return $el.prevAll().length;
  }


  /**
   * @param {ModalView} modalView
   * @return {jQuery}
   */
  function getSelectedTd (modalView) {
    return modalView._$gridContainer.find('.' + SELECTED_TD_CLASS);
  }


  /**
   * @param {ModalView} modalView
   * @return {Coordinate}
   */
  function getSelectedElementCoords (modalView) {
    var $selectedTd = getSelectedTd(modalView);
    var $selectedTr = $selectedTd.parent();
    var x = getElementIndex($selectedTd);
    var y = getElementIndex($selectedTr);

    return {
      'x': x
      ,'y': y
    };
  }


  /**
   * @param {ModalView} modalView
   * @param {Coordinate} coordinate
   */
  function setSelectedElementCoords (modalView, coordinate) {
    var $selectedTd = getSelectedTd(modalView);
    $selectedTd.removeClass(SELECTED_TD_CLASS);
    var x = coordinate.x;
    var y = coordinate.y;
    var selector = 'tr:eq(' + y + ') td:eq(' + x  + ')';
    modalView._$gridContainer.find(selector).addClass(SELECTED_TD_CLASS);
  }


  /**
   * This method augments `coordinate`.
   * @param {ModalView} modalView
   * @param {Coordinate} coordinate
   */
  function validateCoords (modalView, coordinate) {
    var x = coordinate.x;
    var y = coordinate.y;
    var referenceGrid = vKeysHelper.layouts[modalView._currentLayout];

    // Note: The order of these operations is significant.
    if (x < 0) {
      x = referenceGrid[y].length - 1;
    }

    if (y < 0) {
      y = referenceGrid.length - 1;
    }

    if (y > referenceGrid.length - 1) {
      y = 0;
    }

    if (x > referenceGrid[y].length - 1) {
      x = 0;
    }

    coordinate.x = x;
    coordinate.y = y;
  }


  /**
   * @param {ModalView} modalView
   */
  function goUp (modalView) {
    var currentCoords = getSelectedElementCoords(modalView);
    currentCoords.y--;
    validateCoords(modalView, currentCoords);
    setSelectedElementCoords(modalView, currentCoords);
  }


  /**
   * @param {ModalView} modalView
   */
  function goDown (modalView) {
    var currentCoords = getSelectedElementCoords(modalView);
    currentCoords.y++;
    validateCoords(modalView, currentCoords);
    setSelectedElementCoords(modalView, currentCoords);
  }


  /**
   * @param {ModalView} modalView
   */
  function goLeft (modalView) {
    var currentCoords = getSelectedElementCoords(modalView);
    currentCoords.x--;
    validateCoords(modalView, currentCoords);
    setSelectedElementCoords(modalView, currentCoords);
  }


  /**
   * @param {ModalView} modalView
   */
  function goRight (modalView) {
    var currentCoords = getSelectedElementCoords(modalView);
    currentCoords.x++;
    validateCoords(modalView, currentCoords);
    setSelectedElementCoords(modalView, currentCoords);
  }


  /**
   * @param {ModalView} modalView
   */
  function invokeCurrentlySelectedKeyHandler (modalView) {
    var $selectedTd = getSelectedTd(modalView);
    var tDtext = $selectedTd.text()
    var currentTextareaContents = modalView._$textarea.text();
    var caretPosition = modalView._$textarea[0].selectionStart;
    var specialKeyHandler = vKeysHelper.specialKeyHandlers[tDtext];

    if (specialKeyHandler) {
      specialKeyHandler(modalView, currentTextareaContents, caretPosition);
    } else {
      modalView.insertTextareaContentAt(tDtext, caretPosition);
    }
  }


  /**
   * @param {jQuery.<HTMLTextAreaElement>} $textarea
   */
  function updateTextareaState($textarea) {
    $textarea.text($textarea.val());
  }


  /**
   * @extends {Backbone.View}
   * @constructor
   */
  vKeysView.ModalView = Backbone.View.extend({

    'events': {
      'keydown': 'onKeydown'
      ,'keyup': 'onKeyup'
    }

    ,'initialize': function (opts) {
      /** @type {string} */
      this._currentLayout = '';

      /** @type {string} */
      this._proxiedElText = null;

      /** @type {jQuery} */
      this._$proxiedEl = null;

      /** @type {jQuery} */
      this._$textarea = this.$el.find('textarea');

      /** @type {jQuery} */
      this._$gridContainer = this.$el.find('.pine-keyboard-layout-grid');

      this.switchLayout(DEFAULT_LAYOUT);
      this.hide();
      $body.append(this.$el);
    }


    /**
     * @return {string}
     */
    ,'getCurrentLayout': function getCurrentLayout () {
      return this._currentLayout;
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onKeydown': function (evt) {
      var which = evt.which;

      if (which === constants.key.UP) {
        goUp(this);
        evt.preventDefault();
      } else if (which === constants.key.DOWN) {
        goDown(this);
        evt.preventDefault();
      } else if (which === constants.key.LEFT) {
        goLeft(this);
        evt.preventDefault();
      } else if (which === constants.key.RIGHT) {
        goRight(this);
        evt.preventDefault();
      } else if (which === constants.key.ENTER) {
        invokeCurrentlySelectedKeyHandler(this);
        evt.preventDefault();
      }
    }


    /**
     * @param {jQuery.Event} evt
     */
    ,'onKeyup': function (evt) {
      updateTextareaState(this._$textarea);
    }


    /**
     * This is wired up by the accompanying vKeys jQuery plugin.
     * @param {jQuery.Event} evt
     */
    ,'onShow': function (evt) {
      this._$proxiedEl = $(evt.target);
      this.show();
    }


    ,'show': function () {
      if (this._$proxiedEl) {
        this._proxiedElText = this._$proxiedEl.val();
        this._$textarea.val(this._proxiedElText);
        updateTextareaState(this._$textarea);
      }

      this.$el.css('display', 'block');
      this._$textarea.focus();
    }


    /**
     * @param {boolean} updateProxiedEl
     */
    ,'hide': function (updateProxiedEl) {
      if (updateProxiedEl && this._$proxiedEl) {
        this._$proxiedEl.val(this._$textarea.text());
      }

      this.$el.css('display', 'none');

      // This is a heavy-handed way of ensuring that this View loses focus.
      var $focusDiverter = $(document.createElement('input'));
      $body.append($focusDiverter);
      $focusDiverter
        .focus()
        .remove();
    }


    /**
     * @param {string} toLayout
     */
    ,'switchLayout': function (toLayout) {
      this._currentLayout = toLayout;
      this._$gridContainer
        .empty()
        .append(vKeysHelper.builtLayouts[toLayout]);

      setSelectedElementCoords(this, {
        'x': 0
        ,'y': 0
      });
    }


    /**
     * @param {string} newText
     */
    ,'updateTextarea': function (newText) {
      this._$textarea.text(newText);
    }


    /**
     * @param {string} char
     * @param {number} position
     */
    ,'insertTextareaContentAt': function (char, position) {
      var currentContents = this._$textarea.text();
      var currentContentsArr = currentContents.split('');
      currentContentsArr.splice(position, 0, char);
      this._$textarea
        .val(currentContentsArr.join(''))
        .setCursorPosition(position + 1);
    }

  });

});
