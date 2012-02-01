var KeyboardKey;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

KeyboardKey = (function() {

  function KeyboardKey(row, key, index) {
    this.row = row;
    this.key = key;
    this.index = index;
    this.unShift = __bind(this.unShift, this);
    this.shift = __bind(this.shift, this);
    this.deselect = __bind(this.deselect, this);
    this.select = __bind(this.select, this);
    this.processCode = __bind(this.processCode, this);
    this.match_codes = __bind(this.match_codes, this);
    this.init_keys = __bind(this.init_keys, this);
    this.fontSize = __bind(this.fontSize, this);
    this.height = __bind(this.height, this);
    this.width = __bind(this.width, this);
    this.fontRatio = __bind(this.fontRatio, this);
    this.ratio = __bind(this.ratio, this);
    this.keyType = __bind(this.keyType, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.init_keys();
  }

  KeyboardKey.prototype.init_vars = function() {
    var code, keys, _ref, _ref2, _results;
    this.keyboard = this.row.keyboard;
    this.shiftedKey = this.row.shiftedKeys[this.index] || this.key;
    this.observer = this.row.observer;
    this.container = this.row.container;
    this.html = "<div class='key'>" + this.key + "</div>";
    this.element = $(this.html).appendTo(this.container);
    if (this.key && this.key.length === 1) {
      this.charCodes = [this.key.charCodeAt(0), this.shiftedKey.charCodeAt(0)];
    } else {
      this.charCodes = [];
    }
    this.keyCodes = [];
    _ref = this.keyboard.key_codes;
    for (code in _ref) {
      keys = _ref[code];
      if (keys.include(this.key)) this.keyCodes.push(parseInt(code));
    }
    _ref2 = this.keyboard.char_codes;
    _results = [];
    for (code in _ref2) {
      keys = _ref2[code];
      if (keys.include(this.key)) {
        _results.push(this.charCodes.push(parseInt(code)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  KeyboardKey.prototype.keyType = function() {
    var t, _i, _len, _ref;
    if (this.type) return this.type;
    _ref = this.keyboard.key_types;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (this.key.match(t.type) || t.type === 'default') this.type = t;
      if (this.key.match(/(control|option|fn)/) && t.type === 'modifier') {
        this.type = t;
      }
      if (t.codes && t.type === this.type.type) this.keyCodes = t.codes;
    }
    return this.type;
  };

  KeyboardKey.prototype.ratio = function() {
    return this.keyType().ratio.split(':').map(__bind(function(i) {
      return parseFloat(i);
    }, this));
  };

  KeyboardKey.prototype.fontRatio = function() {
    var r;
    r = this.keyType().fontRatio;
    if (!r) return [0];
    return r = r.split(':').map(__bind(function(i) {
      return parseFloat(i);
    }, this));
  };

  KeyboardKey.prototype.width = function() {
    return this.ratio().first() * this.keyboard.scale;
  };

  KeyboardKey.prototype.height = function() {
    return this.ratio().last() * this.keyboard.scale;
  };

  KeyboardKey.prototype.fontSize = function() {
    return (this.height() / this.fontRatio().first()) * this.fontRatio().last();
  };

  KeyboardKey.prototype.init_keys = function() {
    this.element.css({
      width: this.width() + 'px',
      height: this.height() + 'px',
      fontSize: this.fontSize() + 'px',
      'line-height': this.height() + 'px'
    });
    if (!this.fontSize()) {
      this.element.text('');
      this.key = '';
      return this.shiftedKey = '';
    }
  };

  KeyboardKey.prototype.match_codes = function(charCode, keyCode) {
    return this.charCodes.include(charCode) || this.keyCodes.include(keyCode);
  };

  KeyboardKey.prototype.processCode = function(codes) {
    var charCode, keyCode;
    charCode = codes[0], keyCode = codes[1];
    if (this.keyCodes.merge(this.charCodes).include(codes) && !(keyCode === 91)) {
      if (this.key === 'tab') this.observer.prevent_defaults(e);
      return this.select();
    } else {
      return this.deselect();
    }
  };

  KeyboardKey.prototype.select = function() {
    this.element.addClass('active');
    $(window).bind('keyup.deselect', __bind(function(e) {
      this.deselect();
      return $(window).unbind('keyup.deselect');
    }, this));
    if (this.key === 'shift') {
      this.keyboard.shift();
      return $(window).bind('keyup.shift', __bind(function(e) {
        if (this.keyCodes.include(e.keyCode)) {
          this.keyboard.unShift();
          return $(window).unbind('keyup.shift');
        }
      }, this));
    }
  };

  KeyboardKey.prototype.deselect = function() {
    return this.element.removeClass('active');
  };

  KeyboardKey.prototype.shift = function() {
    return this.element.text(this.shiftedKey);
  };

  KeyboardKey.prototype.unShift = function() {
    return this.element.text(this.key);
  };

  return KeyboardKey;

})();
