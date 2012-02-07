var TEXT;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TEXT = "Donec eget enim sit amet quam ullamcorper fermentum hendrerit in vel turpis.\nDonec libero rhoncus tortor sagittis consequat bibendum mauris consequat.";

module("Page", {
  setup: function() {
    return this.page = new Page({
      $container: $("#application"),
      defaultText: function(callback) {
        return callback(TEXT);
      }
    }, {
      width: 320,
      height: 30,
      left: 50,
      top: 20
    });
  }
});

test("#nextSpace selects next typeable space", function() {
  equal(this.page.current_space.index, 0);
  this.page.nextSpace();
  return equal(this.page.current_space.index, 1);
});

test("#nextSpace re-draws text when no more spaces", function() {
  this.page.current_space = _.last(_.last(this.page.rows).spaces);
  this.page.nextSpace();
  return equal(this.page.current_space.index, 0);
});

test("#drawText populates spaces", function() {
  this.page.words = [
    {
      chars: [
        {
          text: "A",
          code: 65,
          typeable: true
        }, {
          text: "a",
          code: 97,
          typeable: true
        }
      ]
    }, {
      chars: [
        {
          text: "B",
          code: 66,
          typeable: true
        }, {
          text: "b",
          code: 98,
          typeable: true
        }
      ]
    }
  ];
  this.page.word_index = 0;
  this.page.drawText();
  equal(this.page.rows[0].spaces[0].char.text, "A");
  equal(this.page.rows[0].spaces[1].char.text, "a");
  ok(this.page.rows[0].spaces[2].is_space);
  equal(this.page.rows[0].spaces[3].char.text, "B");
  equal(this.page.rows[0].spaces[4].char.text, "b");
  ok(this.page.rows[0].spaces[5].is_space);
  return ok(!this.page.rows[0].spaces[6].typeable);
});

test("#drawText buffers words", function() {
  equal(this.page.rows[0].spaces[0].char.text, 'D');
  ok(_.last(this.page.rows[0].spaces).is_space, 'is_space');
  this.page.drawText();
  equal(this.page.rows[0].spaces[0].char.text, 'e');
  equal(this.page.rows[0].spaces[7].char.text, 't');
  ok(this.page.rows[0].spaces[8].is_space);
  ok(!this.page.rows[0].spaces[9].typeable);
  ok(!_.last(this.page.rows[0].spaces).typeable);
  this.page.drawText();
  equal(this.page.rows[0].spaces[0].char.text, 'a');
  equal(this.page.rows[0].spaces[1].char.text, 'm');
  equal(this.page.rows[0].spaces[2].char.text, 'e');
  equal(this.page.rows[0].spaces[3].char.text, 't');
  ok(this.page.rows[0].spaces[4].is_space);
  equal(this.page.rows[0].spaces[5].char.text, 'q');
  equal(this.page.rows[0].spaces[6].char.text, 'u');
  equal(this.page.rows[0].spaces[7].char.text, 'a');
  equal(this.page.rows[0].spaces[8].char.text, 'm');
  ok(this.page.rows[0].spaces[9].is_space);
  ok(!this.page.rows[0].spaces[10].typeable);
  this.page.drawText();
  equal(this.page.rows[0].spaces[0].char.text, 'u');
  equal(this.page.rows[0].spaces[1].char.text, 'l');
  equal(this.page.rows[0].spaces[2].char.text, 'l');
  equal(this.page.rows[0].spaces[3].char.text, 'a');
  equal(this.page.rows[0].spaces[4].char.text, 'm');
  equal(this.page.rows[0].spaces[5].char.text, 'c');
  equal(this.page.rows[0].spaces[6].char.text, 'o');
  equal(this.page.rows[0].spaces[7].char.text, 'r');
  equal(this.page.rows[0].spaces[8].char.text, 'p');
  equal(this.page.rows[0].spaces[9].char.text, 'e');
  equal(this.page.rows[0].spaces[10].char.text, 'r');
  this.page.drawText();
  return ok(this.page.rows[0].spaces[0].is_space);
});

test("#drawText fetches more text when no more words", function() {
  this.page.word_index = this.page.words.length;
  this.page.drawText();
  return equal(this.page.rows[0].spaces[0].char.text, "D");
});

module("Page.Row", {
  setup: function() {
    this.row = new Page.Row({
      config: {
        num_columns: 10
      }
    }, 0);
    this.next_row = new Page.Row({
      config: {
        num_columns: 10
      }
    }, 0);
    return this.row.page.rows = [this.row, this.next_row];
  }
});

test("initialized with @page.config.num_columns spaces", function() {
  return equal(this.row.spaces.length, 10);
});

test("#push(char, char, ...) assigns each char to a space", function() {
  var chars, _ref;
  chars = [
    {
      typeable: true,
      text: "A"
    }, {
      typeable: true,
      text: "B"
    }, {
      typeable: true,
      text: "C"
    }
  ];
  (_ref = this.row).push.apply(_ref, chars);
  equal(this.row.spaces[0].char.text, "A");
  equal(this.row.spaces[1].char.text, "B");
  return equal(this.row.spaces[2].char.text, "C");
});

test("#push(char, char, ...) inserts a space after last char", function() {
  var chars, _ref;
  chars = [
    {
      typeable: true,
      text: "A"
    }, {
      typeable: true,
      text: "B"
    }, {
      typeable: true,
      text: "C"
    }
  ];
  (_ref = this.row).push.apply(_ref, chars);
  equal(this.row.spaces[0].char.text, "A");
  equal(this.row.spaces[1].char.text, "B");
  equal(this.row.spaces[2].char.text, "C");
  ok(this.row.spaces[3].is_space);
  return ok(this.row.space_index = 4);
});

test("#push(char, char, ...) prepends a space to next row if no more spaces", function() {
  this.row.space_index = 9;
  this.row.push({
    typeable: true,
    text: "A"
  });
  return ok(this.next_row.spaces[0].is_space);
});

test("#push(char, char, ...) raises an exception if more chars than spaces", function() {
  this.row.space_index = 10;
  return raises(__bind(function() {
    return this.row.push({
      typeable: true,
      text: "X"
    });
  }, this));
});

test("#destroy removes each space.$element", function() {
  var $element, $last_element;
  $element = this.row.spaces[0].$element;
  $last_element = this.row.spaces[9].$element;
  this.row.destroy();
  ok(!$element.is(':visible'));
  return ok(!$last_element.is(':visible'));
});

module("Page.Row.Space", {
  setup: function() {
    var page, row;
    page = {
      $container: $("#application"),
      config: {
        font_size: 18
      }
    };
    row = {
      space_index: 0
    };
    this.space = new Page.Row.Space(page, row, 0);
    this.space.row.spaces = [this.space];
    return this.space.page.rows = [this.space.row];
  }
});

test("#setSpace makes it a typeable space", function() {
  this.space.setSpace();
  ok(this.space.typeable, 'is typeable');
  ok(this.space.$element.hasClass('space', 'hasClass space'));
  ok(!this.space.$element.hasClass('empty', 'does not have empty class'));
  equal(this.space.$element.html(), "&nbsp;", 'displays a space char');
  equal(this.space.char_codes[0], 32, 'responds to the space char code');
  return equal(this.space.char_codes.length, 1, 'only has one char code');
});

test("#set(char) makes it match char", function() {
  var char;
  char = {
    text: "A",
    code: 65,
    typeable: true
  };
  this.space.set(char);
  ok(this.space.typeable, 'is typeable');
  ok(this.space.$element.hasClass('page-row-char', 'has page-row-char class'));
  return ok(!this.space.$element.hasClass('empty', 'does not have empty class'));
});

test("#set(char) makes space not typeable if char is not typeable", function() {
  var char;
  char = {
    text: "",
    code: 63743,
    typeable: false
  };
  this.space.set(char);
  return ok(!this.space.typeable, 'is not typeable');
});

test("#select adds selected class to $element", function() {
  this.space.select();
  return ok(this.space.$element.hasClass('active', 'has active class'));
});

test("#deselect removes selected class from $element", function() {
  this.space.deselect();
  return ok(!this.space.$element.hasClass('active', 'does not have active class'));
});

test("#hit adds hit class to $element", function() {
  this.space.hit();
  ok(this.space.$element.hasClass('hit', 'has hit class'));
  return ok(!this.space.$element.hasClass('miss', 'does not have miss class'));
});

test("#miss adds miss class to $element", function() {
  this.space.miss();
  ok(this.space.$element.hasClass('miss', 'has miss class'));
  return ok(!this.space.$element.hasClass('hit', 'does not have hit class'));
});

test("#miss creates miss space with mistyped char", function() {
  this.space.miss(65);
  ok(this.space.miss_space, 'has miss space');
  equal(this.space.miss_space.$element.text(), "A", 'miss space has missed text');
  ok(this.space.miss_space.$element.hasClass('page-row-miss-space', 'miss space has page-row-miss-space class'));
  return ok(this.space.miss_space.$element.is(':visible'), 'miss space $element is visible');
});

test("#match matches @char.code", function() {
  this.space.char = {
    code: 65
  };
  ok(this.space.match(65, 'matches @char.code'));
  return ok(!this.space.match(97, 'does not match other char code'));
});

test("#match matches @char_codes if no @char", function() {
  this.space.char_codes = [65, 97];
  ok(this.space.match(65, 'matches @char_codes[0]'));
  ok(this.space.match(97, 'matches @char_codes[1]'));
  return ok(!this.space.match(32, 'does not match other char code'));
});

test("#match doesn't match anything if @miss_space", function() {
  this.space.char_codes = [65, 97];
  this.space.miss(83);
  ok(!this.space.match(65, 'does not match @char_codes[0]'));
  return ok(!this.space.match(97, 'does not match @char_codes[1]'));
});

test("#match destroys @miss_space with backspace", function() {
  var miss_space;
  this.space.char_codes = [65, 97];
  this.space.miss(83);
  miss_space = this.space.miss_space;
  ok(miss_space, 'has @miss_space');
  this.space.match(8);
  ok(!this.space.miss_space, '@miss_space is gone');
  return ok(!miss_space.$element.is(':visible'), '@miss_space $element is gone');
});

test("#isFirst adds 'first' class", function() {
  this.space.isFirst();
  return ok(this.space.$element.hasClass('first'));
});

test("#isLast adds return char code", function() {
  this.space.char_codes = [];
  this.space.isLast();
  return equal(this.space.char_codes[0], 13, 'has return (enter) char code');
});
