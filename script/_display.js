var Display;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {

  function Display(app, options) {
    this.app = app;
    this.options = options;
    this.sanitize = __bind(this.sanitize, this);
    this.snippets_for = __bind(this.snippets_for, this);
    this.draw_snippet = __bind(this.draw_snippet, this);
    this.update = __bind(this.update, this);
    this.pause = __bind(this.pause, this);
    this.next = __bind(this.next, this);
    this.process_char = __bind(this.process_char, this);
    this.bind_events = __bind(this.bind_events, this);
    this.draw_ui = __bind(this.draw_ui, this);
    this.init_observer = __bind(this.init_observer, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.init_observer();
    this.draw_ui();
    this.bind_events();
  }

  Display.prototype.init_vars = function() {
    this.container = $("<section id='display_container'></section>").appendTo(this.app.container);
    this.app.container.append("<div class='clear'></div>");
    this.input = $("<textarea class='input_area'></textarea>").appendTo(this.app.container);
    this.chars = [];
    this.default_options = {
      font_size: 18,
      padding: 4,
      spacing: 1,
      min_chars: 8
    };
    this.options = $.extend(this.default_options, this.options);
    this.charCodeMaps = {
      "'": [8217]
    };
    this.options.size = this.options.font_size + (this.options.padding * 2) + (this.options.spacing * 2);
    return this.options.max_chars = Math.floor((this.options.width / this.options.size) * (this.options.height / this.options.size));
  };

  Display.prototype.init_observer = function() {
    return this.observer = new DisplayObserver(this);
  };

  Display.prototype.draw_ui = function(text) {
    this.text = text;
    this.chars = [];
    if (text) {
      this.snippets = this.snippets_for(text);
      return this.next();
    } else {
      return this.app.default_text(__bind(function(text) {
        this.snippets = this.snippets_for(text);
        return this.next();
      }, this));
    }
  };

  Display.prototype.bind_events = function() {
    return this.input.bind('change', __bind(function() {
      this.currentChar = null;
      this.chars = [];
      return this.draw_ui(this.input.val());
    }, this));
  };

  Display.prototype.process_char = function() {
    this.currentChar.set('inactive');
    return this.next();
  };

  Display.prototype.next = function() {
    this.currentChar = this.chars[this.chars.indexOf(this.currentChar) + 1];
    if (!this.currentChar) {
      this.draw_snippet();
      return;
    }
    return this.currentChar.set('active');
  };

  Display.prototype.pause = function() {
    return this.currentChar.pulse('stop');
  };

  Display.prototype.update = function(key, val) {
    switch (key) {
      case 'wpm':
        return console.log(val);
    }
  };

  Display.prototype.draw_snippet = function() {
    var char, text, _i, _len;
    if (!(this.snippets && this.snippets.length > 0)) {
      return this.draw_ui(this.text);
    }
    text = this.snippets.shift().trim();
    this.container.text('');
    this.chars = [];
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      char = text[_i];
      if (char.match(/\S/)) {
        this.chars.push(new DisplayChar(this, char, this.chars.length));
      } else {
        this.chars.push(new DisplayChar(this, char, this.chars.length, {
          whitespace: true
        }));
      }
    }
    this.chars.push(new DisplayChar(this, " ", this.chars.length, {
      whitespace: true
    }));
    this.chars.first().set('active');
    return this.currentChar = this.chars.first();
  };

  Display.prototype.snippets_for = function(text) {
    var current_snippet, full_snippets, s, snippets, _i, _len;
    text = this.sanitize(text);
    if (text.length >= this.options.max_chars) {
      snippets = text.split(/(\n|\s{2,}|\.)/);
      full_snippets = [];
      current_snippet = "";
      for (_i = 0, _len = snippets.length; _i < _len; _i++) {
        s = snippets[_i];
        if (s.length <= this.options.min_chars || current_snippet.length + s.length <= this.options.max_chars) {
          current_snippet += s;
        } else {
          full_snippets.push(current_snippet.replace(/^(\.|[\r\n\s])+/, '').trim().replace(/[\s\n\s]{2,}/, ' '));
          current_snippet = s;
          full_snippets.push(current_snippet);
          current_snippet = "";
        }
      }
      return full_snippets.flatten(__bind(function(t) {
        return t.length < this.options.min_chars;
      }, this));
    } else {
      return [text];
    }
  };

  Display.prototype.sanitize = function(text) {
    var char, charCodes, index, replacementChar, _len, _ref;
    for (index = 0, _len = text.length; index < _len; index++) {
      char = text[index];
      _ref = this.charCodeMaps;
      for (replacementChar in _ref) {
        charCodes = _ref[replacementChar];
        if (charCodes.include(char.charCodeAt(0))) {
          text = text.replace_at(index, replacementChar);
        }
      }
    }
    return text;
  };

  return Display;

})();
