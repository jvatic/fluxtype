var Event;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;

Event = (function() {

  function Event() {
    this.trigger = __bind(this.trigger, this);
    this.subscribe = __bind(this.subscribe, this);    this.subscribers = [];
  }

  Event.prototype.subscribe = function(callback) {
    if (!(_.include(this.subscribers, callback))) {
      return this.subscribers.push(callback);
    }
  };

  Event.prototype.trigger = function() {
    var args, callback, _i, _len, _ref, _results;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = this.subscribers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.apply(null, args));
    }
    return _results;
  };

  return Event;

})();

export default Event;
