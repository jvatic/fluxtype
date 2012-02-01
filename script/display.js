var Display, DisplayChar, DisplayRow, DisplaySpace, DisplayWord;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {

  function Display(app, options) {
    this.app = app;
    this.options = options;
    this.process_words = __bind(this.process_words, this);
    this.split_words = __bind(this.split_words, this);
    this.init_text = __bind(this.init_text, this);
    this.init_observer = __bind(this.init_observer, this);
    this.init_rows = __bind(this.init_rows, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.init_rows();
    this.init_observer();
    this.init_text();
  }

  Display.prototype.init_vars = function() {
    this.outer_container = $("<section id='display_outer_container'></section>").appendTo(this.app.container);
    this.container = $("<section id='display_container'></section>").appendTo(this.outer_container);
    this.outer_container.append("<div class='clear'></div>");
    this.rows = [];
    this.default_options = {
      font_size: 18,
      padding: 4,
      spacing: 3,
      min_chars: 8
    };
    this.options = $.extend(this.default_options, this.options);
    this.charCodeMaps = {
      "'": [8217]
    };
    this.options.size = this.options.font_size + (this.options.padding * 2) + (this.options.spacing * 2);
    this.options.num_columns = Math.floor((this.container.innerWidth() / this.options.size) + 1);
    this.options.num_rows = Math.floor(this.options.height / this.options.size);
    return this.options.max_chars = this.options.num_columns * this.options.num_rows;
  };

  Display.prototype.init_rows = function() {
    var _i, _ref, _results;
    this.rows.each(__bind(function(row) {
      return row.destroy();
    }, this));
    return this.rows = (function() {
      _results = [];
      for (var _i = 0, _ref = this.options.num_rows; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(__bind(function() {
      return new DisplayRow(this.app, this);
    }, this));
  };

  Display.prototype.init_observer = function() {
    return this.observer = new DisplayObserver(this);
  };

  Display.prototype.init_text = function(text) {
    text || (text = "\"Vut rhoncus 'lectus' mattis! Porta risus integer \"phasellus\"nunc ac tincidunt enim vel\" porta eros nunc, adipiscing scelerisque egestas sed ridiculus?\" Mauris porttitor nunc? 'Nascetur montes', dis diam eu purus, mus augue magna eu augue dignissim tristique odio placerat dapibus scelerisque lectus integer ut placerat enim, placerat est, urna et eu, dignissim nec nunc integer augue aliquam magna. Turpis ac sagittis adipiscing risus, risus? Nisi cras nec, magna tincidunt augue a duis! Ut amet, scelerisque, mauris, porta urna, elit scelerisque? {Habitasse} montes? Odio in? Nisi lectus mus et ultrices turpis eu porttitor in. Cursus platea, tempor integer diam! Phasellus? Nec, lectus ut phasellus enim, ac? Sit proin proin! Non, natoque, sagittis pulvinar, mid rhoncus, tristique enim platea purus et, nec.");
    if (text) {
      text = (text.replace(/([\W"']+)/gi, "<$1>")).replace(/(\w+)/g, "<word>$1</word>");
    } else {
      return this.app.default_text(__bind(function(text) {
        return this.init_text(text);
      }, this));
    }
    return this.process_words(this.split_words(text));
  };

  Display.prototype.split_words = function(text) {
    var first_punctuation, last_punctuation;
    first_punctuation = (text.match(/^<\W+>/ || [])).first();
    last_punctuation = (text.match(/<\W+>$/ || [])).first();
    return [first_punctuation, (text.match(/(<[\s\n\t]\W+>)*<word>\w+<\/word>(<\W+[\s\n\t]>)*/g)) || [], last_punctuation];
  };

  Display.prototype.process_words = function(words) {
    var next_punctuation;
    words = words.flatten();
    next_punctuation = '';
    words = words.map(__bind(function(word) {
      return {
        punctuations_before: ((word.match(/<[\s\n\t]\W+>/g)) || []).join(' '),
        punctuations_after: ((word.match(/<\W+[\s\n\t]>/g)) || []).join(' '),
        word: ((word.match(/<word>\w+<\/word>/g)) || (word.match(/<\W+>/g)) || []).join(' ')
      };
    }, this));
    words.each(__bind(function(item, index) {
      var m;
      if (m = item.word.match(/^<\W+>$/)) {
        words[index] = null;
        if (words[index + 1]) {
          return words[index + 1].punctuations_before += m.join(' ');
        } else if (words[index - 1]) {
          return words[index - 1].punctuations_after += m.join(' ');
        }
      }
    }, this));
    this.row_index = 0;
    this.space_index = 0;
    return this.words = words.flatten().map(__bind(function(item, index) {
      return new DisplayWord(this.app, this, item.punctuations_before, item.word, item.punctuations_after);
    }, this));
  };

  return Display;

})();

DisplayWord = (function() {

  function DisplayWord(app, display, punctuations_before, word, punctuations_after) {
    this.app = app;
    this.display = display;
    this.next_row = __bind(this.next_row, this);
    this.draw_word = __bind(this.draw_word, this);
    this.word = word.replace(/<\/?word>/g, '');
    this.punctuation_before = ((punctuations_before.replace(/<|>|\s/g, '')).match(/\W/g)) || [];
    this.punctuation_after = ((punctuations_after.replace(/<|>|\s/g, '')).match(/\W/g)) || [];
    this.draw_word();
  }

  DisplayWord.prototype.draw_word = function() {
    this.word_length = this.punctuation_before.length + this.word.length + this.punctuation_after.length;
    this.next_row();
    if (!this.row) return;
    if (this.punctuation_before.length === 0) this.punctuation_before = null;
    if (this.punctuation_after.length === 0) this.punctuation_after = null;
    this.chars = [this.punctuation_before, this.word.split(''), this.punctuation_after].flatten().map(__bind(function(char) {
      var space;
      space = this.row.spaces[this.display.space_index];
      if (!space) return;
      return new DisplayChar(this.display, space, char, {
        is_punctuation: char === this.punctuation_before || char === this.punctuation_after
      });
    }, this));
    return this.display.space_index += 1;
  };

  DisplayWord.prototype.next_row = function() {
    this.row = this.display.rows[this.display.row_index];
    if (!this.row) return null;
    if (!this.row.spaces[this.display.space_index + this.word_length]) {
      this.display.row_index += 1;
      this.display.space_index = 0;
      return this.next_row();
    }
  };

  return DisplayWord;

})();

DisplayRow = (function() {

  function DisplayRow(app, display, options) {
    var _i, _ref, _results;
    this.app = app;
    this.display = display;
    this.options = options != null ? options : this.display.options;
    this.destroy = __bind(this.destroy, this);
    this.spaces = (function() {
      _results = [];
      for (var _i = 0, _ref = this.options.num_columns; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(__bind(function() {
      return new DisplaySpace(this.app, this);
    }, this));
    this.spaces.first().isFirst();
  }

  DisplayRow.prototype.destroy = function() {
    return this.spaces.each(__bind(function(space) {
      return space.element.remove();
    }, this));
  };

  return DisplayRow;

})();

DisplaySpace = (function() {

  function DisplaySpace(app, row, display, options) {
    this.app = app;
    this.row = row;
    this.display = display != null ? display : this.row.display;
    this.options = options != null ? options : this.display.options;
    this.isFirst = __bind(this.isFirst, this);
    this.element = $("<div class='display_space'>&nbsp;</div>").appendTo(this.display.container);
    this.element.css({
      width: this.options.font_size
    });
  }

  DisplaySpace.prototype.isFirst = function() {
    return this.element.addClass('first');
  };

  return DisplaySpace;

})();

DisplayChar = (function() {

  function DisplayChar(display, space, char, options) {
    this.display = display;
    this.space = space;
    this.char = char;
    this.options = options;
    this.display.space_index += 1;
    this.element = this.space.element.addClass('display_char');
    this.element.text(this.char);
    if (this.options.is_punctuation) this.element.addClass('punctuation');
  }

  return DisplayChar;

})();
