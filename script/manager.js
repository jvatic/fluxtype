var Manager;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Manager = (function() {

  Manager.SPECIAL_KEYS = [KEYS.BACKSPACE];

  function Manager(base) {
    this.base = base;
    this.processKeyUp = __bind(this.processKeyUp, this);
    this.processKeyDown = __bind(this.processKeyDown, this);
    this.processKeyPress = __bind(this.processKeyPress, this);
    ($(window)).bind('keypress', this.processKeyPress);
    ($(window)).bind('keydown', this.processKeyDown);
    ($(window)).bind('keyup', this.processKeyUp);
  }

  Manager.prototype.processKeyPress = function(e) {
    var space;
    space = this.base.page.current_space;
    if (space && space.match(e.charCode)) {
      space.hit();
      return this.base.page.nextSpace();
    } else {
      return space.miss(e.charCode);
    }
  };

  Manager.prototype.processKeyDown = function(e) {
    var space;
    this.base.keyboard.selectKey(e.charCode, e.keyCode);
    if (_.include(TOUCHY_KEYS, e.keyCode)) e.preventDefault();
    if (_.include(Manager.SPECIAL_KEYS, e.keyCode)) {
      space = this.base.page.current_space;
      return space.match(e.keyCode);
    }
  };

  Manager.prototype.processKeyUp = function(e) {
    return this.base.keyboard.deselectKey(e.charCode, e.keyCode);
  };

  return Manager;

})();
