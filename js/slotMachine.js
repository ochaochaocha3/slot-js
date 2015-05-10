/*global SLOT */

(function () {
  'use strict';

  var
    STATE_STOPPED = 0,
    STATE_MOVING = 1,

    HAND_NONE = 0,
    HAND_SAME = 1,
    HAND_SEVENS = 2,
    SCORE_BY_HAND = [0, 10, 100],

    slotMachinePrototype = {
      allSlotsAreStopped: function allSlotsAreStopped() {
        return this.slots.every(function (slot) {
          return !(slot.isMoving);
        });
      },

      start: function start() {
        this.state = STATE_MOVING;
        return this;
      },

      stop: function stop(pos) {
        this.slots[pos].stop();

        if (this.allSlotsAreStopped()) {
          this.state = STATE_STOPPED;
        }

        return this;
      },

      stopAll: function stopAll() {
        this.slots.forEach(function (slot) {
          slot.stop();
        });

        return this;
      },

      determineHand: function determineHands() {
        var firstNum = this.slots[0].num;

        if (
          this.slots.slice(1).every(function (slot) {
            return slot.num === firstNum;
          })
        ) {
          this.hand = (firstNum === 7) ? HAND_SEVENS : HAND_SAME;
        } else {
          this.hand = HAND_NONE;
        }
      },

      updateScore: function updateScore() {
        if (this.hand === HAND_NONE) {
          if (this.score > this.maxScore) {
            this.maxScore = this.score;
          }

          this.score = 0;
        } else {
          this.score += SCORE_BY_HAND[this.hand];
        }
      },

      update: function update() {
        var
          prevState = this.prevState,
          currentState = this.state;

        switch (currentState) {
        case STATE_MOVING:
          if (prevState !== currentState) {
            this.slots.forEach(function (slot) {
              slot.start();
            });

            if (typeof this.onStart === 'function') {
              this.onStart(this);
            }

            break;
          }

          if (this.moveCount >= 4) {
            this.moveCount = 0;

            this.slots.forEach(function (slot) {
              slot.update();
            });

            break;
          }

          this.moveCount += 1;
          break;
        case STATE_STOPPED:
          if (prevState !== currentState) {
            this.moveCount = 0;

            this.determineHand();
            this.updateScore();

            if (typeof this.onStopAll === 'function') {
              this.onStopAll(this);
            }
          }

          break;
        default:
          break;
        }

        this.prevState = this.state;

        return this;
      }
    },

    newSlotMachine = function newSlotMachine() {
      var machine = Object.create(slotMachinePrototype);

      machine.state = STATE_STOPPED;
      machine.prevState = machine.state;
      machine.slots = [1, 2, 3].map(function (i) {
        return SLOT.newSlot(i);
      });
      machine.moveCount = 0;
      machine.score = 0;
      machine.maxScore = 0;
      machine.hand = HAND_NONE;

      machine.onStart = null;
      machine.onStopAll = null;

      return machine;
    };

  SLOT.newSlotMachine = newSlotMachine;
}());
