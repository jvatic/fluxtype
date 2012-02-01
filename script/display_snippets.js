var DisplaySnippets;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DisplaySnippets = (function() {

  function DisplaySnippets(display, text) {
    this.display = display;
    this.text = text;
    this.sanitize = __bind(this.sanitize, this);
    this.process_rows = __bind(this.process_rows, this);
    this.process_text = __bind(this.process_text, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.process_text();
    this.process_rows();
  }

  DisplaySnippets.prototype.init_vars = function() {
    this.options = this.display.options;
    this.text = this.sanitize(this.text);
    this.snippets = this.text.split(/(\n|\s{2,}|\.)/);
    return this.rows = [];
  };

  DisplaySnippets.prototype.process_text = function() {
    var index, string, _len, _ref;
    _ref = this.snippets;
    for (index = 0, _len = _ref.length; index < _len; index++) {
      string = _ref[index];
      if (string.length > this.options.max_row_chars) {
        this.snippets[index] = string.slice(0, this.options.max_row_chars);
        this.snippets[index + 1] = "" + (string.slice(this.options.max_row_chars, string.length)) + " " + this.snippets[index + 1];
        return this.process_text();
      } else {
        this.rows.push(string);
      }
    }
  };

  DisplaySnippets.prototype.process_rows = function() {
    var index, row_count;
    this.snippets = [];
    index = 0;
    row_count = 0;
    return this.rows.each(__bind(function(row) {
      var _base;
      if (row_count > this.options.max_rows) index++;
      (_base = this.snippets)[index] || (_base[index] = "");
      return this.snippets[index] += row.trim().replace(/^(\.|[\r\n\s])+/, '').trim().replace(/[\s\n\s]{2,}/, ' ');
    }, this));
  };

  DisplaySnippets.prototype.sanitize = function(text) {
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

  return DisplaySnippets;

})();
