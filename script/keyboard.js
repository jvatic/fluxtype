var Keyboard;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Keyboard = (function() {

  function Keyboard(app, config) {
    this.app = app;
    this.config = config;
    this.deselectKey = __bind(this.deselectKey, this);
    this.selectKey = __bind(this.selectKey, this);
    this.unShiftKeys = __bind(this.unShiftKeys, this);
    this.shiftKeys = __bind(this.shiftKeys, this);
    this.config = $.extend({
      width: 700,
      height: 320
    }, this.config);
    this.$container = $("<div class='keyboard'></div>").appendTo(this.app.$container);
    this.key_types = [
      {
        type: 'default',
        ratio: "9:10",
        font_ratio: "15:7"
      }, {
        type: 'tab',
        ratio: "16:10",
        font_ratio: "15:5"
      }, {
        type: 'delete',
        ratio: "16:10",
        font_ratio: "15:5"
      }, {
        type: 'return',
        ratio: "18:10",
        font_ratio: "15:5"
      }, {
        type: 'caps lock',
        ratio: "19:10",
        font_ratio: "15:5"
      }, {
        type: 'shift',
        ratio: "24.5:10",
        font_ratio: "15:5"
      }, {
        type: 'modifier',
        ratio: "9.5:10",
        font_ratio: "15:4"
      }, {
        type: 'command',
        ratio: "11:10",
        font_ratio: "16:4"
      }, {
        type: 'space',
        ratio: "57:10"
      }
    ];
    this.scale = 4.0;
    this.keys = [];
    this.shifted_keys = [];
    this.key_codes = [];
    this.keys.push(['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete']);
    this.shifted_keys.push(['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'delete']);
    this.key_codes.push([192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, KEYS.BACKSPACE]);
    this.keys.push(['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\']);
    this.shifted_keys.push(['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|']);
    this.key_codes.push([KEYS.TAB, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220]);
    this.keys.push(['caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'return']);
    this.shifted_keys.push(['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'return']);
    this.key_codes.push([KEYS.CAPSLOCK, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, KEYS.RETURN]);
    this.keys.push(['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift']);
    this.shifted_keys.push(['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift']);
    this.key_codes.push([KEYS.SHIFT, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, KEYS.SHIFT]);
    this.keys.push(['fn', 'control', 'option', 'command', 'space', 'command', 'option']);
    this.shifted_keys.push(_.last(this.keys));
    this.key_codes.push([null, KEYS.CONTROL, KEYS.OPTION, KEYS.COMMAND, KEYS.SPACE, KEYS.COMMAND, KEYS.OPTION]);
    this.rows = _.map(this.keys, __bind(function(row, index) {
      return new Keyboard.Row(this, row, index);
    }, this));
    this.$container.append($("<div class='clear'></div>"));
  }

  Keyboard.prototype.shiftKeys = function() {
    var key, row, _i, _len, _ref, _results;
    _ref = this.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = row.keys;
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          key = _ref2[_j];
          _results2.push(key.shift());
        }
        return _results2;
      })());
    }
    return _results;
  };

  Keyboard.prototype.unShiftKeys = function() {
    var key, row, _i, _len, _ref, _results;
    _ref = this.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = row.keys;
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          key = _ref2[_j];
          _results2.push(key.unShift());
        }
        return _results2;
      })());
    }
    return _results;
  };

  Keyboard.prototype.selectKey = function(charCode, keyCode) {
    var key, row, _i, _len, _ref, _results;
    _ref = this.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = row.keys;
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          key = _ref2[_j];
          if (key.match(charCode, keyCode)) {
            _results2.push(key.select());
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      })());
    }
    return _results;
  };

  Keyboard.prototype.deselectKey = function(charCode, keyCode) {
    var key, row, _i, _len, _ref, _results;
    _ref = this.rows;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push((function() {
        var _j, _len2, _ref2, _results2;
        _ref2 = row.keys;
        _results2 = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          key = _ref2[_j];
          if (key.match(charCode, keyCode)) {
            _results2.push(key.deselect());
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      })());
    }
    return _results;
  };

  Keyboard.Row = (function() {

    function Row(keyboard, keys, index) {
      var key_codes, shifted_keys;
      this.keyboard = keyboard;
      this.index = index;
      shifted_keys = this.keyboard.shifted_keys[this.index];
      key_codes = this.keyboard.key_codes[this.index];
      this.keys = _.map(keys, __bind(function(key, index) {
        var code, key_class;
        code = key_codes[index];
        key_class = Keyboard.Row.Key;
        if (code === KEYS.SHIFT) key_class = Keyboard.Row.ShiftKey;
        if (code === KEYS.CAPSLOCK) key_class = Keyboard.Row.CapsLockKey;
        return new key_class(this.keyboard, this, key, shifted_keys[index], code, index);
      }, this));
      _.first(this.keys).isFirst();
    }

    Row.Key = (function() {

      function Key(keyboard, row, text, shifted_text, code, index) {
        this.keyboard = keyboard;
        this.row = row;
        this.text = text;
        this.shifted_text = shifted_text;
        this.code = code;
        this.index = index;
        this._parseRatio = __bind(this._parseRatio, this);
        this._calibrate = __bind(this._calibrate, this);
        this._initType = __bind(this._initType, this);
        this.isFirst = __bind(this.isFirst, this);
        this.deselect = __bind(this.deselect, this);
        this.select = __bind(this.select, this);
        this.unShift = __bind(this.unShift, this);
        this.shift = __bind(this.shift, this);
        this.match = __bind(this.match, this);
        this.$element = ($("<div class='key'>" + this.text + "</div>")).appendTo(this.keyboard.$container);
        this._initType();
        this._calibrate();
        this.shifted = false;
        this.selected = false;
      }

      Key.prototype.match = function(charCode, keyCode) {
        return this.code === keyCode;
      };

      Key.prototype.shift = function() {
        this.shifted = true;
        return this.$element.text(this.shifted_text);
      };

      Key.prototype.unShift = function() {
        this.shifted = false;
        return this.$element.text(this.text);
      };

      Key.prototype.select = function() {
        this.$element.addClass('active');
        return this.selected = true;
      };

      Key.prototype.deselect = function() {
        this.$element.removeClass('active');
        return this.selected = false;
      };

      Key.prototype.isFirst = function() {
        return this.$element.addClass('clear');
      };

      Key.prototype._initType = function() {
        var t, _i, _len, _ref, _results;
        _ref = this.keyboard.key_types;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          if (this.text.match(t.type) || t.type === 'default') this.type = t;
          if (this.text.match(/(control)|(option)|(fn)/) && t.type === 'modifier') {
            _results.push(this.type = t);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Key.prototype._calibrate = function() {
        var font_ratio, font_size, height, ratio, width;
        ratio = this._parseRatio(this.type.ratio);
        font_ratio = this.type.font_ratio ? this._parseRatio(this.type.font_ratio) : [0, 0];
        width = ratio[0] * this.keyboard.scale;
        height = ratio[1] * this.keyboard.scale;
        font_size = (height / font_ratio[0]) * font_ratio[1];
        this.$element.css({
          width: width + 'px',
          height: height + 'px',
          fontSize: font_size + 'px',
          'line-height': height + 'px'
        });
        if (!font_size) {
          this.$element.text('');
          this.text = '';
          return this.shifted_text = '';
        }
      };

      Key.prototype._parseRatio = function(string) {
        return _.map(string.split(':'), __bind(function(i) {
          return parseFloat(i);
        }, this));
      };

      return Key;

    })();

    Row.ShiftKey = (function() {

      __extends(ShiftKey, Row.Key);

      function ShiftKey() {
        this.deselect = __bind(this.deselect, this);
        this.select = __bind(this.select, this);        ShiftKey.__super__.constructor.apply(this, arguments);
        this.keyboard.shift_key = this;
      }

      ShiftKey.prototype.select = function() {
        ShiftKey.__super__.select.apply(this, arguments);
        if (this.keyboard.caps_lock_key.selected) {
          return this.keyboard.unShiftKeys();
        } else {
          return this.keyboard.shiftKeys();
        }
      };

      ShiftKey.prototype.deselect = function() {
        ShiftKey.__super__.deselect.apply(this, arguments);
        if (this.keyboard.caps_lock_key.selected) {
          return this.keyboard.shiftKeys();
        } else {
          return this.keyboard.unShiftKeys();
        }
      };

      return ShiftKey;

    })();

    Row.CapsLockKey = (function() {

      __extends(CapsLockKey, Row.Key);

      function CapsLockKey() {
        this.deselect = __bind(this.deselect, this);
        this.select = __bind(this.select, this);        CapsLockKey.__super__.constructor.apply(this, arguments);
        this.keyboard.caps_lock_key = this;
      }

      CapsLockKey.prototype.select = function() {
        CapsLockKey.__super__.select.apply(this, arguments);
        if (this.keyboard.shift_key.selected) {
          return this.keyboard.unShiftKeys();
        } else {
          return this.keyboard.shiftKeys();
        }
      };

      CapsLockKey.prototype.deselect = function() {
        CapsLockKey.__super__.deselect.apply(this, arguments);
        if (this.keyboard.shift_key.selected) {
          return this.keyboard.shiftKeys();
        } else {
          return this.keyboard.unShiftKeys();
        }
      };

      return CapsLockKey;

    })();

    return Row;

  }).call(this);

  return Keyboard;

}).call(this);
