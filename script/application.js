var FluxType;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require_js({
  underscore: true,
  helpers: true,
  constants: true,
  keyboard: true,
  keyboard_row: true,
  keyboard_key: true,
  page: true
}, function(success) {
  return $(function() {
    return window.flux_type = new FluxType($('#application'));
  });
});

FluxType = (function() {

  function FluxType($container) {
    this.$container = $container;
    this.defaultText = __bind(this.defaultText, this);
    this.drawUI = __bind(this.drawUI, this);
    this.initVars = __bind(this.initVars, this);
    this.initVars();
    this.drawUI();
  }

  FluxType.prototype.initVars = function() {
    return this.snipets = {};
  };

  FluxType.prototype.drawUI = function() {
    this.page = new Page(this, {
      width: this.$container.width() - 100,
      height: 160,
      left: 50,
      top: 20
    });
    return;
    return this.keyboard = new Keyboard(this, {
      width: this.$container.width() - 100,
      height: 320
    });
  };

  FluxType.prototype.defaultText = function(callback) {
    if (this.snipets.default_text) {
      callback(this.snipets.default_text);
    } else {
      $.ajax({
        url: '/default_text',
        success: __bind(function(text) {
          this.snipets.default_text = text;
          return callback(text);
        }, this)
      });
    }
    return null;
  };

  return FluxType;

})();
