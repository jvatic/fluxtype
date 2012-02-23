var FluxType;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require_js({
  underscore: true,
  'store-js': true,
  constants: true,
  event: true,
  keyboard: true,
  page: true,
  status: true,
  manager: true,
  hangman: window.location.href.match(/hangman/) ? true : void 0
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
    this.events = {
      page_init: new Event,
      manager_init: new Event
    };
    this.drawUI();
  }

  FluxType.prototype.drawUI = function() {
    this.status = new Status(this);
    this.page = new Page(this, {
      width: this.$container.innerWidth(),
      height: 160,
      left: 50,
      top: 20
    });
    this.events.page_init.trigger();
    this.keyboard = new Keyboard(this, {
      width: this.$container.width() - 100,
      height: 320
    });
    if (window.Hangman) this.hangman = new Hangman(this);
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
