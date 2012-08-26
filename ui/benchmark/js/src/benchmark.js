;(function (global) {

  'use strict';


  var testName = document.getElementById('test-name');
  var framerateOutput = document.getElementById('framerate-output');
  var framerate = new Framerate();
  framerate.onUpdate = function (rate) {
    framerateOutput.textContent = rate;
  };


  /**
   * @return {Object} Represents the page's URL query parameters.
   */
  function getQueryParams () {
    var params = {};
    var search = window.location.search || '?';
    // Chop off the leading "?"
    var choppedSearch = search.slice(1);
    var splitSearch = choppedSearch.split('&');
    splitSearch.forEach(function (chunk) {
      var keyValPair = chunk.split('=');
      params[keyValPair[0]] = keyValPair[1];
    });

    return params;
  }


  function tick () {
    webkitRequestAnimationFrame(tick);
    framerate.tick();
  }


  // Test init logic
  (function () {
    var queryParams = getQueryParams();
    tick();

    // This is the default test.
    if (!queryParams.benchmark || queryParams.benchmark === 'idle') {
      testName.textContent += ' - Idle';
    }
  } ());

} (this));
