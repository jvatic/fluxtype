var KeyboardRow;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

KeyboardRow = (function() {

  function KeyboardRow(keyboard, row, index) {
    this.keyboard = keyboard;
    this.row = row;
    this.index = index;
    this.processCode = __bind(this.processCode, this);
    this.container = this.keyboard.container;
    this.shiftedKeys = this.keyboard.shiftedKeys[this.index];
    this.observer = this.keyboard.observer;
    this.keys = this.row.map(__bind(function(key, index) {
      return new KeyboardKey(this, key, index);
    }, this));
    $("<div class='clear'></div>").insertAfter(this.keys.last().element);
  }

  KeyboardRow.prototype.processCode = function(codes, e) {
    return this.keys.each(__bind(function(key) {
      return key.processCode(codes, e);
    }, this));
  };

  return KeyboardRow;

})();
