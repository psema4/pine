// This file is exempt from standard style guide rules.
define(['exports'], function (vKeysHelper) {

  'use strict';

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
    '1234567890    '.split('')
    ,'!@#$%^&*-_=+[]'.split('')
    ,'{}()<>`~\\/;:\'"'.split('')
    ,['Backspace', 'Enter']
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
    'Enter': function (modalView, currentString) {
      modalView.updateTextarea(currentString + '\n');
    }

    ,'Backspace': function (modalView, currentString, caretPosition) {
      var splitString = currentString.split('');
      splitString.splice(caretPosition - 1, 1);
      modalView.updateTextarea(splitString.join(''));
    }

    ,'Toggle layout': function (modalView, currentString) {
      var newLayout = modalView.getCurrentLayout() === 'uppercase'
        ? 'lowercase'
        : 'uppercase';
      modalView.switchLayout(newLayout);
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
