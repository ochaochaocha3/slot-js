/*global $, SLOT */
$(function () {
  'use strict';

  var
    slot0 = SLOT.newSlot(0),
    $slot0 = $('#slot-0'),
    $stop0 = $('#stop-0'),
    $start = $('#start');

  slot0.onIncrement = function (slot) {
    $slot0.text(slot.num);
  };

  slot0.onStart = function () {
    $stop0.prop('disabled', false);
  };

  slot0.onStop = function () {
    $stop0.prop('disabled', true);
  };

  $start.click(function () {
    slot0.start();
    slot0.increment();
  });

  $stop0.click(function () {
    slot0.stop();
  });

  $slot0.text(slot0.num);
});
