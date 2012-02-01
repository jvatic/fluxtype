var FluxType;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require_js({
  helpers: true,
  constants: true,
  keyboard: true,
  keyboard_row: true,
  keyboard_key: true,
  display: true,
  display_char: true,
  display_observer: true
}, function(success) {
  return $(function() {
    return $.FluxType = new FluxType($('#application'));
  });
});

FluxType = (function() {

  function FluxType(container) {
    this.container = container;
    this.default_text = __bind(this.default_text, this);
    this.draw_ui = __bind(this.draw_ui, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.draw_ui();
  }

  FluxType.prototype.init_vars = function() {
    this.canvas_config = {
      width: this.container.width(),
      height: this.container.height(),
      node: this.container.get(0)
    };
    return this.snipets = {};
  };

  FluxType.prototype.draw_ui = function() {
    this.display = new Display(this, {
      width: this.container.width() - 100,
      height: 160,
      left: 50,
      top: 20
    });
    return this.keyboard = new Keyboard(this, {
      width: this.container.width() - 100,
      height: 320
    });
  };

  FluxType.prototype.default_text = function(callback) {
    if (this.snipets.default_text) {
      callback.call(null, this.snipets.default_text);
    } else {
      $.ajax({
        url: '/default_text',
        success: __bind(function(text) {
          this.snipets.default_text = text;
          return callback.call(null, text);
        }, this)
      });
    }
    return null;
  };

  return FluxType;

})();
