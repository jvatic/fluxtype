var Manager;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Manager = (function() {

  function Manager(base) {
    this.base = base;
    this.processKeyUp = __bind(this.processKeyUp, this);
    this.processKeyDown = __bind(this.processKeyDown, this);
    this.processKeyPress = __bind(this.processKeyPress, this);
    this.$hidden_input = ($("<textarea type='text' class='hidden-input' value='Q'></textarea>")).prependTo(this.base.$container);
    this.events = {
      key_press: new Event,
      key_down: new Event,
      key_up: new Event
    };
    this.base.events.manager_init.trigger(this);
    ($(document)).bind('keypress', this.processKeyPress);
    ($(document)).bind('keydown', this.processKeyDown);
    ($(document)).bind('keyup', this.processKeyUp);
    ($(document)).bind('focus', __bind(function() {
      var keyCode, _i, _len, _ref, _results;
      _ref = [KEYS.CONTROL, KEYS.COMMAND, KEYS.OPTION, KEYS.SHIFT];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        keyCode = _ref[_i];
        _results.push(this.base.keyboard.deselectKey(null, keyCode));
      }
      return _results;
    }, this));
  }

  Manager.prototype.processKeyPress = function(e) {
    this.$hidden_input.val('Q');
    if (e.keyCode === KEYS.BACKSPACE) return null;
    e.charCode || (e.charCode = e.which);
    return this.events.key_press.trigger(e.charCode);
  };

  Manager.prototype.processKeyDown = function(e) {
    if (_.include(TOUCHY_KEYS, e.keyCode)) e.preventDefault();
    return this.events.key_down.trigger(e.charCode, e.keyCode);
  };

  Manager.prototype.processKeyUp = function(e) {
    return this.events.key_up.trigger(e.charCode, e.keyCode);
  };

  return Manager;

})();
