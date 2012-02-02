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

  Page.prototype.resetRows = function() {
    var _i, _ref, _results;
    _.each(this.rows, __bind(function(row) {
      return row.destroy();
    }, this));
    return this.rows = _.map((function() {
      _results = [];
      for (var _i = 0, _ref = this.config.num_rows; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), __bind(function() {
      return new Page.Row(this);
    }, this));
  };

  Page.prototype.drawText = function() {
    this.resetRows();
    if (this.word_index >= this.words.length) this.word_index = 0;
    return _.each(this.rows, __bind(function(row, row_index) {
      var word, word_index, _len, _ref, _results;
      _ref = _.rest(this.words, this.word_index);
      _results = [];
      for (word_index = 0, _len = _ref.length; word_index < _len; word_index++) {
        word = _ref[word_index];
        if (_.rest(row.spaces, row.space_index).length >= word.chars.length) {
          row.push.apply(row, word.chars);
          _results.push(this.word_index += 1);
        } else {
          break;
        }
      }
      return _results;
    }, this));
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

    function Row(page) {
      var _i, _ref, _results;
      this.page = page;
      this.destroy = __bind(this.destroy, this);
      this.push = __bind(this.push, this);
      this.spaces = _.map((function() {
        _results = [];
        for (var _i = 0, _ref = this.page.config.num_columns; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), __bind(function() {
        return new Page.Row.Space(this.page, this);
      }, this));
      (_.first(this.spaces)).isFirst();
      this.space_index = 0;
    }

    Row.prototype.push = function() {
      var chars;
      chars = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.each(chars, __bind(function(char, char_index) {
        this.spaces[this.space_index].set(char);
        return this.space_index += 1;
      }, this));
      return this.space_index += 1;
    };

    Row.prototype.destroy = function() {
      return _.each(this.spaces, __bind(function(space) {
        return space.$element.remove();
      }, this));
    };

    Row.Space = (function() {

      function Space(page, row) {
        this.page = page;
        this.row = row;
        this.isFirst = __bind(this.isFirst, this);
        this.set = __bind(this.set, this);
        this.$element = ($("<div class='page-row-space empty'>&nbsp;</div>")).appendTo(this.page.$container);
        this.$element.css({
          width: this.page.config.font_size
        });
      }

      Space.prototype.set = function(char) {
        this.char = char;
        this.$element.text(this.char.text);
        this.$element.addClass('page-row-char');
        if (this.char.typeable) return this.$element.removeClass('empty');
      };

      Space.prototype.isFirst = function() {
        return this.$element.addClass('first');
      };

      return Space;

    })();

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
      }

      return Char;

    })();

    return Word;

  }).call(this);

  return Page;

}).call(this);
