// This file is exempt from standard style guide rules.
define(['exports'], function (vKeysHelper) {

  'use strict';

  // This function was unabashedly copy/pasted from:
  // http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
  $.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }

    return this;
  }


  /** @type {string} */
  vKeysHelper.modalTemplate = [
    '<div class="pine-keyboard">'
      ,'<div class="pine-keyboard-scrim"></div>'
      ,'<div class="pine-keyboard-textarea-container">'
        ,'<textarea></textarea>'
        ,'<div class="pine-keyboard-layout-grid"></div>'
      ,'</div>'
    ,'</div>'
  ].join('');


  /** @type {Array.<string>} */
  var standardLayoutPartial = [
    '1234567890  ⇦⇨'.split('')
    ,'!@#$%^&*-_=+[]'.split('')
    ,'{}()<>`~\\/;:\'"'.split('')
    ,['Backspace', 'Enter']
    ,['Cancel', 'Accept']
    ,['Toggle layout']
  ];


  // Sorry about this nonsensical typedef...
  /** @type {{<Array.<Array.<string>>>}} */
  vKeysHelper.layouts = {
    'uppercase':
      ['ABCDEFGHIJKLMN'.split('')
      ,'OPQRSTUVWXYZ  '.split('')]

    ,'lowercase':
      ['abcdefghijklmn'.split('')
      ,'opqrstuvwxyz  '.split('')]
  };

  _.each(vKeysHelper.layouts, function (layout, layoutName) {
    vKeysHelper.layouts[layoutName] =
        vKeysHelper.layouts[layoutName].concat(standardLayoutPartial);
  });


  /** @type {{Function(ModalView, string, ?number)}} */
  vKeysHelper.specialKeyHandlers = {

    'Enter': function (modalView, currentString, caretPosition) {
      modalView.insertTextareaContentAt('\n', caretPosition);
    }


    ,'Backspace': function (modalView, currentString, caretPosition) {
      var splitString = currentString.split('');
      splitString.splice(caretPosition - 1, 1);
      modalView.updateTextarea(splitString.join(''));
      modalView._$textarea.setCursorPosition(caretPosition - 1);
    }


    ,'Toggle layout': function (modalView, currentString) {
      var newLayout = modalView.getCurrentLayout() === 'uppercase'
        ? 'lowercase'
        : 'uppercase';
      modalView.switchLayout(newLayout);
    }


    ,'Cancel': function (modalView, currentString, caretPosition) {
      modalView.hide();
    }


    ,'Accept': function (modalView, currentString, caretPosition) {
      modalView.hide(true);
    }


    ,'⇦': function (modalView, currentString, caretPosition) {
      modalView._$textarea.setCursorPosition(caretPosition - 1);
    }


    ,'⇨': function (modalView, currentString, caretPosition) {
      modalView._$textarea.setCursorPosition(caretPosition + 1);
    }

  };


  /**
   * Note: This method assumes quite a bit about `layout`.  It assumes that the
   * first row equals the length of the grid.  It also assumes that rows that
   * are too short divide cleanly in the table length (no decimals).
   * @param {Array.<Array.<string>>} layout
   * @return {jQuery}
   */
  vKeysHelper.buildTableFromLayout = function (layout) {
    var htmlChunks = ['<table><thead></thead><tbody>'];
    var tableLength;

    layout.forEach(function (row) {
      var rowLength = row.length;

      if (!tableLength) {
        tableLength = rowLength;
      }

      htmlChunks.push('<tr>');
      row.forEach(function (column) {
        htmlChunks.push(buildTd(column, rowLength, tableLength));
      });
      htmlChunks.push('</tr>');
    });

    htmlChunks.push('</tbody></table>');
    return $(htmlChunks.join(''));
  };


  /**
   * @param {string} content
   * @param {number} rowLength
   * @param {number} tableLength
   */
  function buildTd (content, rowLength, tableLength) {
    var colspan;

    if (rowLength !== tableLength) {
      colspan = tableLength / rowLength;
    }

    var tdHtml;

    if (colspan) {
      tdHtml = '<td colspan="' + colspan + '">' + content + '</td>';
    } else {
      tdHtml = '<td>' + content + '</td>';
    }

    return tdHtml;
  }


  /**
   * @return {Object.<jQuery>}
   */
  vKeysHelper.buildAllLayoutTables = function () {
    var layoutTables = {};
    _.each(vKeysHelper.layouts, function (layout, layoutName) {
      layoutTables[layoutName] =
        vKeysHelper.buildTableFromLayout(layout);
    });

    return layoutTables;
  }

  /** @type {Object.<jQuery>} */
  vKeysHelper.builtLayouts = vKeysHelper.buildAllLayoutTables();

});
