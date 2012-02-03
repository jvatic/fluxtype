var Manager;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Manager = (function() {

  Manager.SPECIAL_KEYS = [8, 48];

  function Manager(base) {
    this.base = base;
    this.processSpecialKey = __bind(this.processSpecialKey, this);
    this.processKey = __bind(this.processKey, this);
    ($(window)).bind('keypress', this.processKey);
    ($(window)).bind('keydown', this.processSpecialKey);
  }

  Manager.prototype.processKey = function(e) {
    var space;
    console.log(e.keyCode);
    space = this.base.page.current_space;
    if (space && space.match(e.charCode)) {
      space.hit();
      return this.base.page.nextSpace();
    } else {
      return space.miss(e.charCode);
    }
  };

  Manager.prototype.processSpecialKey = function(e) {
    var space;
    if (_.include(Manager.SPECIAL_KEYS, e.keyCode)) {
      space = this.base.page.current_space;
      return space.match(e.keyCode);
    }
  };

  return Manager;

})();
