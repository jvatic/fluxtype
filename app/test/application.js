import FluxType from '../src/fluxtype';

const TEXT = "The quick brown fox jumps over the lazy dog";

QUnit.module("Core", {
  setup: function() {
    this.app = new FluxType($('#application'));
    return $.mockjax({
      url: '/text',
      responseText: TEXT,
      responseTime: 100
    });
  },
  teardown: function() {
    return $.mockjaxClear();
  }
});

QUnit.test("Compenents initialize", function() {
  expect(4);
  if (!this.app) return;
  ok(this.app.status, 'Status');
  ok(this.app.page, 'Page');
  ok(this.app.keyboard, 'Keyboard');
  return ok(this.app.manager, 'Manager');
});

QUnit.asyncTest("#defaultText calls /text endpoint", function() {
  expect(1);
  if (!this.app) return start();
  return this.app.defaultText(function(text) {
    equal(text, TEXT);
    return start();
  });
});
