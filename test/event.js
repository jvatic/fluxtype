import Event from '../src/event';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;

QUnit.module('Event', {
  setup: function() {
    return this.event = new Event;
  }
});

QUnit.test("handles subscribtions", function() {
  var callback;
  callback = function() {};
  this.event.subscribe(callback);
  return equal(this.event.subscribers.length, 1);
});

QUnit.test("calls subscribers when triggered", function() {
  var callback;
  this.callback_count = 0;
  callback = __bind(function() {
    return this.callback_count += 1;
  }, this);
  this.event.subscribers = [callback, callback, callback];
  this.event.trigger();
  return equal(this.callback_count, 3);
});

QUnit.test("calls subscribers with all arguments passed to trigger", function() {
  var callback;
  this.callback_args_count = 0;
  callback = __bind(function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.callback_args_count = args.length;
  }, this);
  this.event.subscribers = [callback];
  this.event.trigger(1, 2, 3);
  return equal(this.callback_args_count, 3);
});
