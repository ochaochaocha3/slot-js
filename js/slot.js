/*global SLOT */

(function () {
  'use strict';

  var
    slotPrototype = {
      start: function start() {
        this.isMoving = true;

        if (typeof this.onStart === 'function') {
          this.onStart(this);
        }

        return this;
      },

      stop: function stop() {
        this.isMoving = false;

        if (typeof this.onStop === 'function') {
          this.onStop(this);
        }

        return this;
      },

      increment: function increment() {
        if (this.num >= 9) {
          this.num = 0;
        } else {
          this.num += 1;
        }

        if (typeof this.onIncrement === 'function') {
          this.onIncrement(this);
        }

        return this;
      },

      update: function update() {
        if (this.isMoving) {
          this.increment();
        }

        return this;
      }
    },

    newSlot = function newSlot(num) {
      var slot = Object.create(slotPrototype);

      slot.isMoving = false;
      slot.num = (num === undefined) ? 0 : num;

      slot.onStart = null;
      slot.onStop = null;
      slot.onIncrement = null;

      return slot;
    };

  SLOT.newSlot = newSlot;
}());
