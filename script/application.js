var FluxType;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require_js({
  underscore: true,
  helpers: true,
  constants: true,
  keyboard: true,
  page: true,
  manager: true
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
    this.drawUI();
  }

  FluxType.prototype.drawUI = function() {
    this.page = new Page(this, {
      width: this.$container.width() - 100,
      height: 160,
      left: 50,
      top: 20
    });
    this.keyboard = new Keyboard(this, {
      width: this.$container.width() - 100,
      height: 320
    });
    return this.manager = new Manager(this);
  };

  FluxType.prototype.defaultText = function(callback) {
    return $.ajax({
      url: '/default_text',
      success: __bind(function(text) {
        return callback(text);
      }, this)
    });
  };

  return FluxType;

})();
