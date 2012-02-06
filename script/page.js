var Page;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;

Page = (function() {

  function Page(base, config) {
    var default_config;
    this.base = base;
    this.config = config;
    this._initTemplate = __bind(this._initTemplate, this);
    this._initText = __bind(this._initText, this);
    this.drawText = __bind(this.drawText, this);
    this.resetRows = __bind(this.resetRows, this);
    this.nextSpace = __bind(this.nextSpace, this);
    this._initTemplate();
    this.rows = [];
    default_config = {
      font_size: 18,
      padding: 4,
      spacing: 3
    };
    this.config = $.extend(default_config, this.config);
    this.config.space_size = this.config.font_size + (this.config.padding * 2) + (this.config.spacing * 2);
    this.config.num_columns = Math.floor((this.$container.innerWidth() / this.config.space_size) + 1);
    this.config.num_rows = Math.floor(this.config.height / this.config.space_size);
    this.config.max_chars = this.config.num_columns * this.config.num_rows;
    this._initText();
  }

  Page.prototype.nextSpace = function() {
    var next, next_row, space;
    this.current_space.deselect();
    space = this.current_space;
    next = space.row.spaces[space.index + 1];
    if (next_row = this.rows[space.row.index + 1]) {
      if (!next) next = _.first(next_row.spaces);
    }
    if (!next) return this.drawText();
    this.current_space = next;
    if (!this.current_space.typeable) this.nextSpace();
    return this.current_space.select();
  };

  Page.prototype.resetRows = function() {
    var _i, _ref, _results;
    _.each(this.rows, __bind(function(row) {
      return row.destroy();
    }, this));
    return this.rows = _.map((function() {
      _results = [];
      for (var _i = 0, _ref = this.config.num_rows; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), __bind(function(index) {
      return new Page.Row(this, index);
    }, this));
  };

  Page.prototype.drawText = function() {
    var last_space;
    this.resetRows();
    if (this._start_with_space === true) {
      this._start_with_space = false;
      _.first(_.first(this.rows).spaces).setSpace();
      _.first(this.rows).space_index = 1;
    }
    if (this.word_index >= this.words.length) return this._initText();
    _.each(this.rows, __bind(function(row, row_index) {
      var last_space, word, word_index, _len, _ref, _results;
      _ref = _.rest(this.words, this.word_index);
      _results = [];
      for (word_index = 0, _len = _ref.length; word_index < _len; word_index++) {
        word = _ref[word_index];
        if (_.rest(row.spaces, row.space_index).length >= word.chars.length) {
          row.push.apply(row, word.chars);
          _results.push(this.word_index += 1);
        } else {
          last_space = row.spaces[row.space_index - 1];
          if (last_space) last_space.isLast();
          break;
        }
      }
      return _results;
    }, this));
    last_space = _.last(_.last(this.rows).spaces);
    if (last_space.typeable && !last_space.is_space) this._start_with_space = true;
    this.current_space = _.first(_.first(this.rows).spaces);
    if (!this.current_space.typeable) this.nextSpace();
    return this.current_space.select();
  };

  Page.prototype._initText = function(text) {
    if (!text) {
      return this.base.defaultText(__bind(function(text) {
        return this._initText(text);
      }, this));
    }
    this.words = _.map(text.split(/[\s\n\t]+/), __bind(function(word) {
      return new Page.Word(this, word);
    }, this));
    this.word_index = 0;
    return this.drawText();
  };

  Page.prototype._initTemplate = function() {
    var element_id_index, html;
    element_id_index = {
      outer_container: 'page-outer-container',
      container: 'page-container'
    };
    html = "<div id='" + element_id_index.outer_container + "'>\n  <div id='" + element_id_index.container + "'>\n  </div>\n  <div class='clear'></div>\n</div>";
    ($(html)).appendTo(this.base.$container);
    return this.$container = $("#" + element_id_index.container);
  };

  Page.Row = (function() {

    function Row(page, index) {
      var _i, _ref, _results;
      this.page = page;
      this.index = index;
      this.destroy = __bind(this.destroy, this);
      this.push = __bind(this.push, this);
      this.spaces = _.map((function() {
        _results = [];
        for (var _i = 0, _ref = this.page.config.num_columns; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), __bind(function(index) {
        return new Page.Row.Space(this.page, this, index);
      }, this));
      (_.first(this.spaces)).isFirst();
      this.space_index = 0;
    }

    Row.prototype.push = function() {
      var chars, next_row;
      chars = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.each(chars, __bind(function(char, char_index) {
        this.spaces[this.space_index].set(char);
        return this.space_index += 1;
      }, this));
      if (this.spaces[this.space_index]) {
        this.spaces[this.space_index].setSpace();
      } else {
        if (next_row = this.page.rows[this.index + 1]) {
          next_row.spaces[next_row.space_index].setSpace();
          next_row.space_index += 1;
        }
      }
      return this.space_index += 1;
    };

    Row.prototype.destroy = function() {
      return _.each(this.spaces, __bind(function(space) {
        return space.$element.remove();
      }, this));
    };

    Row.Space = (function() {

      function Space(page, row, index) {
        this.page = page;
        this.row = row;
        this.index = index;
        this.isLast = __bind(this.isLast, this);
        this.isFirst = __bind(this.isFirst, this);
        this.miss = __bind(this.miss, this);
        this.hit = __bind(this.hit, this);
        this.deselect = __bind(this.deselect, this);
        this.select = __bind(this.select, this);
        this.match = __bind(this.match, this);
        this.set = __bind(this.set, this);
        this.setSpace = __bind(this.setSpace, this);
        this.$element = ($("<div class='page-row-space empty'>&nbsp;</div>")).appendTo(this.page.$container);
        this.$element.css({
          width: this.page.config.font_size
        });
        this.char_codes = [" ".charCodeAt(0)];
        this.typeable = false;
      }

      Space.prototype.setSpace = function() {
        this.typeable = true;
        this.is_space = true;
        this.$element.html("&nbsp;");
        this.$element.removeClass('empty');
        return this.$element.addClass('space');
      };

      Space.prototype.set = function(char) {
        this.char = char;
        this.$element.text(this.char.text);
        this.$element.addClass('page-row-char');
        this.$element.removeClass('empty');
        this.typeable = this.char.typeable;
        if (!this.typeable) return this.$element.addClass('skip');
      };

      Space.prototype.match = function(charCode) {
        if (this.miss_space) {
          if (charCode === KEYS.BACKSPACE) {
            this.miss_space.$element.remove();
            this.miss_space = void 0;
          }
          return false;
        }
        if (this.char) {
          return this.char.code === charCode;
        } else {
          return _.include(this.char_codes, charCode);
        }
      };

      Space.prototype.select = function() {
        return this.$element.addClass('active');
      };

      Space.prototype.deselect = function() {
        return this.$element.removeClass('active');
      };

      Space.prototype.hit = function() {
        return this.$element.addClass('hit');
      };

      Space.prototype.miss = function(charCode) {
        this.$element.addClass('miss');
        this.miss_space || (this.miss_space = new Page.Row.Space.MissSpace(this));
        return this.miss_space.set(String.fromCharCode(charCode));
      };

      Space.prototype.isFirst = function() {
        return this.$element.addClass('first');
      };

      Space.prototype.isLast = function() {
        return this.char_codes.push("\r".charCodeAt(0));
      };

      Space.MissSpace = (function() {

        function MissSpace(space) {
          var left, next_space, top;
          this.space = space;
          this.set = __bind(this.set, this);
          this.$element = ($("<div class='page-row-miss-space'>&nbsp;</div>")).appendTo(this.space.page.$container);
          next_space = this.space.row.spaces[this.space.index + 1];
          if (!next_space) {
            next_space = _.first((this.space.page.rows[this.space.row.index + 1] || {}).spaces || []);
          }
          top = (next_space || this.space).$element.position().top + 1;
          left = (next_space || this.space).$element.position().left + 1;
          this.$element.css({
            position: 'absolute',
            top: top,
            left: left,
            width: this.space.$element.width(),
            height: this.space.$element.height()
          });
        }

        MissSpace.prototype.set = function(text) {
          return this.$element.text(text);
        };

        return MissSpace;

      })();

      return Space;

    }).call(this);

    return Row;

  }).call(this);

  Page.Word = (function() {

    function Word(page, text) {
      this.page = page;
      this.text = text;
      this.chars = _.map(this.text.split(''), __bind(function(char) {
        return new Page.Word.Char(this.page, this, char);
      }, this));
    }

    Word.Char = (function() {

      Char.TYPEABLE_MATCHER = /^[-a-z0-9_~`!@#$%^&*\(\)-+=\|\\\}\{\[\]"':;?\/><,.\s\t]$/i;

      function Char(page, word, text) {
        this.page = page;
        this.word = word;
        this.text = text;
        this.typeable = this.text.match(Page.Word.Char.TYPEABLE_MATCHER) !== null;
        this.code = this.text.charCodeAt(0);
      }

      return Char;

    })();

    return Word;

  }).call(this);

  return Page;

}).call(this);
