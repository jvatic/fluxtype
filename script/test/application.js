var TEXT;

TEXT = "The quick brown fox jumps over the lazy dog";

module("Core", {
  setup: function() {
    this.app = new FluxType($('#application'));
    return $.mockjax({
      url: '/default_text',
      responseText: TEXT,
      responseTime: 0
    });
  },
  teardown: function() {
    return $.mockjaxClear();
  }
});

test("Compenents initialize", function() {
  ok(this.app.status, 'Status');
  ok(this.app.page, 'Page');
  ok(this.app.keyboard, 'Keyboard');
  return ok(this.app.manager, 'Manager');
});

asyncTest("#defaultText calls /default_text endpoint", function() {
  return this.app.defaultText(function(text) {
    equal(text, TEXT);
    return start();
  });
});
