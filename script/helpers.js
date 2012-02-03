var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
