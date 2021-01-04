import Status from '../src/status';
import Event from '../src/event';
import { assertDifference } from './test_helper';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

QUnit.module("Status", {
  setup: function() {
    Store.clear();
    return this.status = new Status({
      events: {
        page_init: new Event
      }
    });
  }
});

QUnit.test("records hit", function() {
  expect(1);
  return assertDifference(this.status, 'hits.length', 1, __bind(function(finish) {
    this.status.recordHit({});
    return finish();
  }, this));
});

QUnit.test("records miss", function() {
  expect(1);
  return assertDifference(this.status, 'misses.length', 1, __bind(function(finish) {
    this.status.recordMiss({});
    return finish();
  }, this));
});

QUnit.test("records hit speeds", function() {
  expect(1);
  return assertDifference(this.status, 'hit_speeds.length', 10, __bind(function(finish) {
    var n;
    for (n = 1; n <= 10; n++) {
      this.status.recordHit({});
    }
    return finish();
  }, this), "Status#hit_speeds is 10 for every 10 hits");
});

QUnit.test("records wpms", function() {
  expect(1);
  return assertDifference(this.status, 'wpms.length', 2, __bind(function(finish) {
    var n;
    for (n = 1; n <= 10; n++) {
      this.status.recordHit({});
    }
    return finish();
  }, this), "Status#wpms.length is 2 for every 10 hits");
});

QUnit.test("#wpmBufferAvg calculates wpm average", function() {
  var n, _i, _j;
  this.status.wpm_buffer = 4;
  for (_i = 1; _i <= 10; _i++) {
    this.status.recordHitSpeed(1);
  }
  equal(this.status.wpmBufferAvg(), 12, '2 words, 5 seconds each');
  for (n = 1; n <= 10; n++) {
    this.status.recordHitSpeed(n);
  }
  equal(this.status.wpmBufferAvg(), 7.375, '4 words, 12, 12, 4, and 1.5 seconds respectivly');
  for (_j = 1; _j <= 5; _j++) {
    this.status.recordHitSpeed(2);
  }
  return equal(this.status.wpmBufferAvg(), 5.875, '4 words (buffer), 12, 4, 1.5, and 6 seconds respectivly');
});
