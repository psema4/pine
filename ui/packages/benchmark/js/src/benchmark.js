;(function (global) {

  'use strict';


  var onTick = function () {};
  var docEl = document.documentElement;
  var testName = document.getElementById('test-name');
  var framerateOutput = document.getElementById('framerate-output');
  var squareCountOutput = document.getElementById('square-count-output');
  var squareCountOutputDD = squareCountOutput.querySelector('dd');
  var scratch = document.getElementById('scratch');

  var framerate = new Framerate();
  framerate.onUpdate = function (rate) {
    framerateOutput.textContent = rate;
  };

  // Set up event listeners if we are running the game directly (not via the
  // Pine interface).
  if (pine.env.isDev) {
    ['keydown', 'keyup'].forEach(function (eventName) {
      docEl.addEventListener(eventName, function (evt) {
        if (evt.which === 8) { // backspace
          evt.preventDefault();
        }
      });
    });
  }


  // HELPER FUNCTIONS
  //


  function tick () {
    webkitRequestAnimationFrame(tick);
    onTick();
    framerate.tick();
  }


  /**
   * @return {Array.<HTMLElement>}
   */
  function getChildren (parent) {
    var children = parent.children;
    return Array.prototype.slice.call(children, 0);
  }


  /**
   * @return {string}
   */
  function getRandomColorString () {
    return 'rgb('
        + Math.floor(Math.random() * 256) + ','
        + Math.floor(Math.random() * 256) + ','
        + Math.floor(Math.random() * 256) + ')';
  }


  // BENCHMARK HELPERS
  //


  function  updateSquareCount () {
    squareCountOutputDD.textContent = getChildren(scratch).length;
  }


  function addRotatingDiv () {
    var div = document.createElement('div');
    div.classList.add('js-rotator');
    div.style.backgroundColor = getRandomColorString();
    div.style.left = (Math.random() * 90) + '%';
    div.style.top = (Math.random() * 90) + '%';
    div.style.webkitTransform = 'rotate(0deg)';
    scratch.appendChild(div);
    var childCount = getChildren(scratch).length;
    updateSquareCount();
  }


  function removeRotatingDiv () {
    var children = getChildren(scratch);

    if (children.length) {
      var lastChild = children[children.length - 1];
      scratch.removeChild(lastChild);
      updateSquareCount();
    }
  }


  function rotatingDivsBenchmarkOnTick () {
    if (pine.gamepad.downKeys.R1) {
      addRotatingDiv();
    }

    if (pine.gamepad.downKeys.L1) {
      removeRotatingDiv();
    }

    var childrenArr = getChildren(scratch);
    childrenArr.forEach(function (child) {
      var currentTransform = child.style.webkitTransform;
      var currentRotation = +currentTransform.match(/\d+/)[0];
      var newRotation = ++currentRotation % 360;
      child.style.webkitTransform = 'rotate(' + newRotation + 'deg)';
    });
  }


  // BENCHMARKS
  //

  function runRotatingDivsBenchmark () {
    docEl.addEventListener('keydown', function (evt) {
      var keycode = evt.which;
      if (keycode === 32) { // space
        addRotatingDiv();
      } else if (keycode === 8) { // backspace
        removeRotatingDiv();
      }
    });

    onTick = rotatingDivsBenchmarkOnTick;
    squareCountOutput.style.display = 'block';
  }


  // Test init logic
  testName.textContent += ' - Rotating Divs';
  runRotatingDivsBenchmark();
  tick();

} (this));
