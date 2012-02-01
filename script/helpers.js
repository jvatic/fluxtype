var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;

String.prototype.times = function(n) {
  var i, s;
  s = "";
  for (i = 0; 0 <= n ? i <= n : i >= n; 0 <= n ? i++ : i--) {
    s += this;
  }
  return s;
};

String.prototype.trim = function() {
  return this.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '');
};

String.prototype.replace_at = function(index, char) {
  return this.substr(0, index) + char + this.substr(index + char.length);
};

Array.prototype.map = function(callback) {
  var index, item, new_array, _len;
  new_array = [];
  for (index = 0, _len = this.length; index < _len; index++) {
    item = this[index];
    new_array.push(callback.call(this, item, index));
  }
  return new_array;
};

Array.prototype.map_pair = function(callback) {
  var new_array;
  new_array = [];
  this.each_pair(__bind(function(a, b, index, length) {
    return new_array.push.apply(new_array, [callback.call(new_array, a, b, index, length)].unique());
  }, this));
  return new_array;
};

Array.prototype.each = function(callback) {
  var i, index, _len;
  for (index = 0, _len = this.length; index < _len; index++) {
    i = this[index];
    callback.call(this, i, index);
  }
  return this;
};

Array.prototype.each_pair = function(callback) {
  var i, _i, _j, _len, _ref, _ref2, _results;
  _ref2 = (function() {
    _results = [];
    for (var _j = 0, _ref = this.length; 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results.push(_j); }
    return _results;
  }).apply(this).flatten(__bind(function(item) {
    return item % 2 !== 0;
  }, this));
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    i = _ref2[_i];
    callback.call(this, this[i], this[i + 1], i, 1);
  }
  return this;
};

Array.prototype.prev = function(current) {
  return this[this.indexOf(current) - 1];
};

Array.prototype.next = function(current) {
  return this[this.indexOf(current) + 1];
};

Array.prototype.flatten = function(callback) {
  var index, item, new_array, _len;
  new_array = [];
  callback || (callback = __bind(function(item) {
    return !item;
  }, this));
  for (index = 0, _len = this.length; index < _len; index++) {
    item = this[index];
    if (item && typeof item === 'object' && item.length) {
      new_array.push.apply(new_array, item.flatten(callback));
      new_array = new_array.flatten(callback);
    } else {
      if (!callback.call(new_array, item, index)) new_array.push(item);
    }
  }
  return new_array;
};

Array.prototype.merge = function() {
  var arrays;
  arrays = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return [this, arrays].flatten(function(item) {
    return this.include(item);
  });
};

Array.prototype.include = function(items, options) {
  var does_include, item, item_included, _i, _len;
  this.options = options != null ? options : {};
  if (!(typeof items === 'object' && items.length)) items = [items];
  does_include = true;
  for (_i = 0, _len = items.length; _i < _len; _i++) {
    item = items[_i];
    item_included = this.indexOf(item) !== -1;
    if (this.options.all) {
      if (!item_included) does_include = false;
    } else {
      if (item_included) return true;
    }
  }
  if (this.options.all) {
    return does_include;
  } else {
    return false;
  }
};

Array.prototype.sum = function() {
  var n, s, _i, _len;
  s = 0;
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    n = this[_i];
    n = parseFloat(n);
    if (n) s += n;
  }
  return s;
};

Array.prototype.mean = function() {
  return this.sum() / this.length;
};

Array.prototype.prevUntil = function(callback, startIndex) {
  var index, item, _len, _ref;
  _ref = this.slice(0, startIndex).reverse();
  for (index = 0, _len = _ref.length; index < _len; index++) {
    item = _ref[index];
    if (callback.call(this, item)) return item;
  }
  return null;
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.last = function() {
  return this[this.length - 1];
};

Array.prototype.factors = function() {
  var common, f, factors, is_common, n, _i, _j, _k, _len, _len2, _len3;
  factors = [];
  common = [];
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    n = this[_i];
    factors.push.apply(factors, Math.factors(n));
  }
  for (_j = 0, _len2 = factors.length; _j < _len2; _j++) {
    f = factors[_j];
    is_common = true;
    for (_k = 0, _len3 = this.length; _k < _len3; _k++) {
      n = this[_k];
      if (n % f !== 0) is_common = false;
    }
    if (is_common) common.push(f);
  }
  return common.unique();
};

Array.prototype.max = function() {
  return Math.max.apply(Math, this);
};

Array.prototype.unique = function() {
  return this.flatten(function(item) {
    return this.include(item);
  });
};

Math.factors = function(n) {
  var f, i;
  f = [];
  for (i = n; n <= 0 ? i < 0 : i > 0; n <= 0 ? i++ : i--) {
    if (n % i === 0) f.push(i);
  }
  return f;
};

Math.aspect_ratio = function() {
  var common_factor, dimensions;
  dimensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  common_factor = dimensions.factors().max();
  return dimensions.map(__bind(function(d) {
    return d / common_factor;
  }, this)).join(":");
};

Math.fits_apsect_ratio = function() {
  var common_factor, d, dimensions, factor, fit, i, ratio, _len;
  ratio = arguments[0], dimensions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (typeof ratio === 'string') ratio = ratio.split(':');
  if (ratio.length !== dimensions.length) throw "Ratio must fit dimensions";
  fit = true;
  common_factor = null;
  for (i = 0, _len = dimensions.length; i < _len; i++) {
    d = dimensions[i];
    factor = d / ratio[i];
    common_factor || (common_factor = factor);
    if (factor !== common_factor) fit = false;
  }
  return fit;
};
