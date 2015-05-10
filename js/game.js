/*global $, SLOT */
$(function () {
  'use strict';

  var
    machine = SLOT.newSlotMachine(),
    FPS = 25,
    $slots = [$('#slot-0'), $('#slot-1'), $('#slot-2')],
    $stops = [$('#stop-0'), $('#stop-1'), $('#stop-2')],
    $start = $('#start'),
    $currentScore = $('#current-score'),
    $maxScore = $('#max-score'),

    timer = null,
    tick = function tick() {
      machine.update();

      if (machine.allSlotsAreStopped()) {
        timer = null;
      } else {
        timer = window.setTimeout(tick, FPS);
      }
    };

  [0, 1, 2].forEach(function (i) {
    var slot = machine.slots[i];

    slot.onIncrement = function (s) {
      $slots[i].text(s.num);
    };

    slot.onStart = function () {
      $stops[i].prop('disabled', false);
    };

    slot.onStop = function () {
      $stops[i].prop('disabled', true);
    };

    $stops[i].click(function () {
      machine.stop(i);
    });

    $slots[i].text(slot.num);
    slot.stop();
  });

  machine.onStart = function () {
    $start.prop('disabled', true);
  };

  machine.onStopAll = function () {
    $currentScore.text(machine.score);
    if (machine.score > machine.maxScore) {
      $currentScore.addClass('updating-max-score');
    } else {
      $currentScore.removeClass('updating-max-score');
    }

    $maxScore.text(machine.maxScore);

    $start.prop('disabled', false);
  };

  $start.click(function () {
    machine.slots.forEach(function (slot) {
      slot.num = Math.floor(Math.random() * 10);
    });
    machine.start();
    timer = window.setTimeout(tick, FPS);
  });

  $start.prop('disabled', false);
});
