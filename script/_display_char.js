var DisplayChar;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DisplayChar = (function() {

  function DisplayChar(display, char, index, options) {
    this.display = display;
    this.char = char;
    this.index = index;
    this.options = options != null ? options : {};
    this.whitespace_html = __bind(this.whitespace_html, this);
    this.pulse = __bind(this.pulse, this);
    this.prev = __bind(this.prev, this);
    this.set = __bind(this.set, this);
    this.position = __bind(this.position, this);
    this.html = __bind(this.html, this);
    this.match_codes = __bind(this.match_codes, this);
    this.init_codes = __bind(this.init_codes, this);
    this.init_element = __bind(this.init_element, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.init_codes();
    this.init_element();
  }

  DisplayChar.prototype.init_vars = function() {
    this.default_options = {
      "class": {
        active: 'active'
      }
    };
    return this.options = $.extend(this.default_options, this.options);
  };

  DisplayChar.prototype.init_element = function() {
    var index, word_break;
    this.element = $(this.html()).appendTo(this.display.container);
    if (this.position().left === 0 && this.display.chars.length !== 0) {
      index = this.display.chars.length;
      word_break = this.display.chars.prevUntil(__bind(function(char) {
        return char.char.match(/^\s*$/);
      }, this), index);
      if (word_break) {
        word_break.element.next().addClass('clear');
        return word_break.keyCodes.push(KEYS.RETURN);
      }
    }
  };

  DisplayChar.prototype.init_codes = function() {
    this.charCodes = [this.char.charCodeAt(0)];
    return this.keyCodes = [];
  };

  DisplayChar.prototype.match_codes = function(charCode, keyCode) {
    return this.charCodes.include(charCode) || this.keyCodes.include(keyCode);
  };

  DisplayChar.prototype.html = function() {
    if (this.options.whitespace) {
      return this.whitespace_html();
    } else {
      return "<div class='char'>" + this.char + "</div>";
    }
  };

  DisplayChar.prototype.position = function() {
    return {
      top: this.element.position().top,
      left: this.element.position().left
    };
  };

  DisplayChar.prototype.set = function(status) {
    switch (status) {
      case 'active':
        return this.pulse('start');
      case 'inactive':
        return this.pulse('stop');
    }
  };

  DisplayChar.prototype.prev = function() {
    return this.display.chars[this.index - 1];
  };

  DisplayChar.prototype.next = null;

  DisplayChar.prototype.pulse = function(status) {
    if (status === 'start') {
      return this.pulseInterval = setInterval(__bind(function() {
        this.element.removeClass(this.options["class"].active);
        return this.pulseTimeout = setTimeout(__bind(function() {
          return this.element.addClass(this.options["class"].active);
        }, this), 50);
      }, this), 500);
    } else {
      clearTimeout(this.pulseTimeout);
      clearInterval(this.pulseInterval);
      return this.element.removeClass(this.options["class"].active).addClass('old');
    }
  };

  DisplayChar.prototype.whitespace_html = function() {
    var space;
    space = "&nbsp;";
    if (this.char.match(/\t/)) {
      space = space.times(4);
    } else {
      space = space.times(2);
    }
    return "<div class='char space'>" + space + "</div>";
  };

  return DisplayChar;

})();
