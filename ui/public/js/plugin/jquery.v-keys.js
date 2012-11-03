/*jslint nomen: true, plusplus: true, undef: true, todo: true, white: true,
  browser: true, indent: 2, maxlen: 80 */
/*global Backbone: false, _: false, $: false, KeyRouter: false, publish: false,
  subscribe: false */

define(['./v-keys-helper', './../view/view.v-keys']
    ,function (vKeysHelper, vKeysView) {

  'use strict';

  /** @type {jQuery} */
  var $modal = $(vKeysHelper.modalTemplate);

  /** @type {ModalView} */
  var modalView = new vKeysView.ModalView({'el': $modal[0]});


  $.fn.vKeys = function () {
    this.on('focus', _.bind(modalView.onShow, modalView));
  };

});
