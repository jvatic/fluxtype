var Manager;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Manager = (function() {

  function Manager(base) {
    this.base = base;
    this.processKey = __bind(this.processKey, this);
    ($(window)).bind('keypress', this.processKey);
  }

  Manager.prototype.processKey = function(e) {
    var space;
    space = this.base.page.current_space;
    if (space && space.match(e.charCode)) {
      space.hit();
      return this.base.page.nextSpace();
    } else {
      return space.miss(e.charCode);
    }
  };

  return Manager;

})();
