var DisplayObserver;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DisplayObserver = (function() {

  function DisplayObserver(display) {
    this.display = display;
    this.pause = __bind(this.pause, this);
    this.process_key = __bind(this.process_key, this);
    this.bind_events = __bind(this.bind_events, this);
    this.prevent_defaults = __bind(this.prevent_defaults, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.bind_events();
  }

  DisplayObserver.prototype.init_vars = function() {
    this.durations = [];
    return this.velocity = 0;
  };

  DisplayObserver.prototype.prevent_defaults = function(e) {
    e.preventDefault();
    return e.stopImmediatePropagation();
  };

  DisplayObserver.prototype.bind_events = function() {
    $(window).bind('keydown', __bind(function(e) {
      return this.display.app.keyboard.processCode([e.charCode, e.keyCode], e);
    }, this));
    return $(window).bind('keypress', this.process_key);
  };

  DisplayObserver.prototype.process_key = function(e) {
    if (this.display.currentChar && this.display.currentChar.match_codes(e.charCode, e.keyCode)) {
      this.prevent_defaults(e);
      this.display.process_char();
    }
  };

  DisplayObserver.prototype.pause = function() {
    return this.display.pause();
  };

  return DisplayObserver;

})();
