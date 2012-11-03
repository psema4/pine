/**
 * Framerate.js
 *
 * A minimalistic framerate monitor in JavaScript.
 *   by Jeremy Kahn (jeremyckahn@gmail.com)
 * MIT License.
 *
 * Usage:
 *
 *   var framerate = new Framerate();
 *   framerate.onUpdate = function (rate) {
 *     console.log(rate);
 *   };
 *
 *
 * And then, somewhere in your application code, do this once per animation
 * frame:
 *
 *   framerate.tick();
 */
;(function (global) {

  'use strict';


  function noop () {}


  /**
   * @return {number}
   */
  function now () {
    return +new Date();
  }


  /**
   * @param {Framerate} framerate
   * @param {number} newEpoch
   */
  function recycle (framerate, newEpoch) {
    framerate._ticksAccumulated = 0;
    framerate._cycleEpoch = newEpoch;
  }


  /**
   * @param {Framerate} framerate
   */
  function calculateFramerate (framerate) {
    var oldEpoch = framerate._cycleEpoch;
    var newEpoch = now();
    var delta = newEpoch - oldEpoch;
    var scaledDelta = delta / 1000;
    framerate.rate = framerate._ticksAccumulated / scaledDelta;
    recycle(framerate, newEpoch);
  }


  /**
   * @param {Framerate} framerate
   */
  function scheduleRecalculation (framerate) {
    framerate._updateHandle = setTimeout(function () {
      scheduleRecalculation(framerate);
      calculateFramerate(framerate);
      framerate.onUpdate(framerate.rate);
    }, framerate._sampleRate);
  }


  /**
   * @param {Object?} opts
   *  @param {number} sampleRate
   * @constructor
   */
  var Framerate = global.Framerate = function (opts) {
    opts = opts || {};

    /** @type {number} */
    this._ticksAccumulated = 0;

    /** @type {number} */
    this._sampleRate = opts.sampleRate || 500;

    /** @type {number} */
    this._cycleEpoch = now();

    /** @type {number} */
    this._updateHandle = null;

    /** @type {number} */
    this.rate = null;

    /** @type {function} */
    this.onUpdate = noop;

    scheduleRecalculation(this);
  };


  var fn = Framerate.prototype;


  fn.tick = function () {
    this._ticksAccumulated++;
  };

} (this));
