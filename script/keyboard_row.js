var KeyboardRow;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

KeyboardRow = (function() {

  function KeyboardRow(keyboard, row, index) {
    this.keyboard = keyboard;
    this.row = row;
    this.index = index;
    this.processCode = __bind(this.processCode, this);
    this.$container = this.keyboard.$container;
    this.shifted_keys = this.keyboard.shifted_keys[this.index];
    this.keys = _.map(this.row, __bind(function(key, index) {
      return new KeyboardKey(this, key, index);
    }, this));
    $("<div class='clear'></div>").insertAfter(_.last(this.keys).element);
  }

  KeyboardRow.prototype.processCode = function(codes, e) {
    return _.each(this.keys, __bind(function(key) {
      return key.processCode(codes, e);
    }, this));
  };

  return KeyboardRow;

})();
