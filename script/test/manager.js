var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module("Manager", {
  setup: function() {
    return this.manager = new Manager({
      $container: $("#application"),
      page: {
        nextSpace: __bind(function() {
          return this.space_index = (this.space_index || 0) + 1;
        }, this),
        current_space: {
          match: function() {
            return true;
          },
          hit: function() {
            return null;
          },
          miss: function() {
            return null;
          }
        }
      },
      status: {
        recordHit: __bind(function() {
          return this.hit_count = (this.hit_count || 0) + 1;
        }, this),
        recordMiss: __bind(function() {
          return this.miss_count = (this.miss_count || 0) + 1;
        }, this)
      },
      keyboard: {
        selectKey: __bind(function(charCode, keyCode) {
          return this.selected_key = keyCode;
        }, this),
        deselectKey: __bind(function() {
          return this.selected_key = null;
        }, this)
      }
    });
  }
});

test("keypress within window deligates to page and status", function() {
  var e;
  e = $.Event("keypress");
  e.charCode = 97;
  ($(window)).trigger(e);
  equal(this.space_index, 1, '@base.page.nextSpace called');
  equal(this.hit_count, 1, '@base.state.recordHit called');
  this.manager.base.page.current_space.match = function() {
    return false;
  };
  ($(window)).trigger(e);
  equal(this.space_index, 1, '@base.page.nextSpace not called');
  equal(this.hit_count, 1, '@base.state.recordHit not called');
  return equal(this.miss_count, 1, '@base.state.recordMiss called');
});

test("#processKeyPress does nothing for backspace", function() {
  return equal(this.manager.processKeyPress({
    keyCode: 8
  }), null);
});

test("keydown within window deligates to keyboard", function() {
  var e;
  e = $.Event("keydown");
  e.keyCode = 13;
  ($(window)).trigger(e);
  return equal(this.selected_key, 13, 'keyboard called with keyCode');
});

test("#precessKeyDown sends backspace to current space", function() {
  this.manager.base.page.current_space.match = __bind(function(code) {
    return this.space_code = code;
  }, this);
  this.manager.processKeyDown({
    keyCode: 8,
    preventDefault: function() {
      return null;
    }
  });
  return equal(this.space_code, 8);
});

test("keyup within window deligates to keyboard", function() {
  var e;
  this.selected_key = 8;
  e = $.Event("keyup");
  e.keyCode = this.selected_key;
  ($(window)).trigger(e);
  return equal(this.selected_key, null, 'keyboard called with keyCode');
});
