export var assertDifference = function(base_obj, method_chain, amount, callback, message) {
  var finish, method, original_value;
  method_chain = method_chain.split('.');
  method = function(obj, method_chain) {
    var link, _i, _len;
    for (_i = 0, _len = method_chain.length; _i < _len; _i++) {
      link = method_chain[_i];
      if (!obj) continue;
      obj = obj[link];
    }
    if (typeof obj === 'function') obj = obj();
    return obj;
  };
  original_value = method(base_obj, method_chain);
  finish = function() {
    var actual_value;
    actual_value = method(base_obj, method_chain);
    return equal(actual_value, original_value + amount, message || ("" + (base_obj.toString()) + "#" + (method_chain.join('.')) + " changes by " + amount));
  };
  return callback(finish);
};

QUnit.module("assertDifference");

QUnit.test("property chain changes by 1", function() {
  var obj;
  expect(1);
  obj = {
    foo: {
      bar: 1
    },
    toString: function() {
      return "<Hash:obj>";
    }
  };
  return assertDifference(obj, 'foo.bar', 1, function(finish) {
    obj.foo.bar += 1;
    return finish();
  });
});

QUnit.test("property changes by -3", function() {
  var obj;
  expect(1);
  obj = {
    foo: 1,
    toString: function() {
      return "<Hash:obj>";
    }
  };
  return assertDifference(obj, 'foo', -3, function(finish) {
    obj.foo -= 3;
    return finish();
  });
});

QUnit.test("method changes by 2", function() {
  var obj;
  expect(1);
  obj = {
    count: 3,
    foo: {}
  };
  obj.foo.bar = function() {
    return obj.count;
  };
  return assertDifference(obj, 'foo.bar', 2, function(finish) {
    obj.count += 2;
    return finish();
  });
});
