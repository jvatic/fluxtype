import Status from './status';
import Page from './page';
import Keyboard from './keyboard';
import Event from './event';
import Manager from './manager';
import Hangman from './hangman';

var FluxType;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    if (_.last(window.location.href.split('/')) === 'hangman') {
      this.hangman = new Hangman(this);
    }
    return this.manager = new Manager(this);
  };

  FluxType.prototype.defaultText = function(callback) {
    return $.ajax({
      url: '/text',
      success: __bind(function(text) {
        return callback(text);
      }, this)
    });
  };

  return FluxType;

})();

export default FluxType;
