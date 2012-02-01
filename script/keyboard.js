var Keyboard;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Keyboard = (function() {

  function Keyboard(app, options) {
    this.app = app;
    this.options = options;
    this.unShift = __bind(this.unShift, this);
    this.shift = __bind(this.shift, this);
    this.processCode = __bind(this.processCode, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_options = __bind(this.init_options, this);
    this.init_options();
    this.init_vars();
  }

  Keyboard.prototype.init_options = function() {
    return this.options = $.extend({
      width: 700,
      height: 320
    }, this.options);
  };

  Keyboard.prototype.init_vars = function() {
    this.container = $("<div class='keyboard'></div>").appendTo(this.app.container);
    this.observer = this.app.display.observer;
    this.key_types = [
      {
        type: 'default',
        ratio: "9:10",
        fontRatio: "15:7"
      }, {
        type: 'tab',
        ratio: "16:10",
        fontRatio: "15:5",
        codes: [9]
      }, {
        type: 'delete',
        ratio: "16:10",
        fontRatio: "15:5",
        codes: [8]
      }, {
        type: 'return',
        ratio: "18:10",
        fontRatio: "15:5",
        codes: [13]
      }, {
        type: 'caps lock',
        ratio: "19:10",
        fontRatio: "15:5",
        codes: [20]
      }, {
        type: 'shift',
        ratio: "24.5:10",
        fontRatio: "15:5",
        codes: [16]
      }, {
        type: 'modifier',
        ratio: "9.5:10",
        fontRatio: "15:4"
      }, {
        type: 'command',
        ratio: "11:10",
        fontRatio: "16:4"
      }, {
        type: 'space',
        ratio: "57:10",
        codes: [32]
      }
    ];
    this.scale = 4.0;
    this.keys = [];
    this.shiftedKeys = [];
    this.keys.push(['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete']);
    this.shiftedKeys.push(['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'delete']);
    this.keys.push(['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\']);
    this.shiftedKeys.push(['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|']);
    this.keys.push(['caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'return']);
    this.shiftedKeys.push(['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'return']);
    this.keys.push(['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift']);
    this.shiftedKeys.push(['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift']);
    this.keys.push(['fn', 'control', 'option', 'command', 'space', 'command', 'option']);
    this.shiftedKeys.push(this.keys.last());
    this.key_codes = {
      61: ['='],
      187: ['='],
      186: [';'],
      188: [','],
      189: ['-'],
      190: ['.'],
      191: ['/'],
      192: ['`'],
      219: ['['],
      220: ['\\'],
      221: [']'],
      222: ['\'']
    };
    this.char_codes = {
      8217: ['\'']
    };
    return this.rows = this.keys.map(__bind(function(row, index) {
      return new KeyboardRow(this, row, index);
    }, this));
  };

  Keyboard.prototype.processCode = function(codes, e) {
    return this.rows.each(__bind(function(row) {
      return row.processCode(codes, e);
    }, this));
  };

  Keyboard.prototype.shift = function() {
    return this.rows.each(__bind(function(row) {
      return row.keys.each(__bind(function(key) {
        return key.shift();
      }, this));
    }, this));
  };

  Keyboard.prototype.unShift = function() {
    return this.rows.each(__bind(function(row) {
      return row.keys.each(__bind(function(key) {
        return key.unShift();
      }, this));
    }, this));
  };

  return Keyboard;

})();
