var Manager;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Manager = (function() {

  function Manager(base) {
    this.base = base;
    this.processKeyUp = __bind(this.processKeyUp, this);
    this.processKeyDown = __bind(this.processKeyDown, this);
    this.processKeyPress = __bind(this.processKeyPress, this);
    this.$hidden_input = ($("<textarea type='text' class='hidden-input' value='Q'></textarea>")).prependTo(this.base.$container);
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
    var space;
    this.$hidden_input.val('Q');
    if (e.keyCode === KEYS.BACKSPACE) return null;
    e.charCode || (e.charCode = e.which);
    space = this.base.page.current_space;
    if (space && space.match(e.charCode)) {
      space.hit();
      this.base.page.nextSpace();
      return this.base.status.recordHit(space);
    } else if (space) {
      space.miss(e.charCode);
      return this.base.status.recordMiss(space);
    }
  };

  Manager.prototype.processKeyDown = function(e) {
    var space;
    this.base.keyboard.selectKey(e.charCode, e.keyCode);
    if (_.include(TOUCHY_KEYS, e.keyCode)) e.preventDefault();
    if (_.include([KEYS.BACKSPACE], e.keyCode)) {
      space = this.base.page.current_space;
      return space.match(e.keyCode);
    }
  };

  Manager.prototype.processKeyUp = function(e) {
    return this.base.keyboard.deselectKey(e.charCode, e.keyCode);
  };

  return Manager;

})();
