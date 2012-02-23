var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module("Manager", {
  setup: function() {
    return this.manager = new Manager({
      $container: $("#application"),
      events: {
        manager_init: new Event
      },
      page: {
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

test("#processKeyPress does nothing for backspace", function() {
  return equal(this.manager.processKeyPress({
    keyCode: 8
  }), null);
});

test("keydown within document deligates to keyboard", function() {
  var e;
  e = $.Event("keydown");
  e.keyCode = 13;
  ($(document)).trigger(e);
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

test("keyup within document deligates to keyboard", function() {
  var e;
  this.selected_key = 8;
  e = $.Event("keyup");
  e.keyCode = this.selected_key;
  ($(document)).trigger(e);
  return equal(this.selected_key, null, 'keyboard called with keyCode');
});
