var Require;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Require = (function() {

  function Require(scripts, callback) {
    this.scripts = scripts;
    this.callback = callback;
    this.finish = __bind(this.finish, this);
    this.process = __bind(this.process, this);
    this.num_loaded_paths = __bind(this.num_loaded_paths, this);
    this.fetch_paths = __bind(this.fetch_paths, this);
    this.require = __bind(this.require, this);
    this.init_vars = __bind(this.init_vars, this);
    this.init_vars();
    this.fetch_paths();
  }

  Require.prototype.init_vars = function() {
    var path, should, _ref;
    this.paths = [];
    _ref = this.scripts;
    for (path in _ref) {
      should = _ref[path];
      if (should && this.paths.indexOf(path) === -1) this.paths.push(path);
    }
    this.loaded_paths = [];
    this.error_paths = [];
    this.embeded_paths = [];
    return this.container = $("#javascript");
  };

  Require.prototype.require = function(scripts, callback) {
    var path, should;
    if (!(scripts && callback)) throw "Expected: (scripts, callback)";
    this.callback = callback;
    for (path in scripts) {
      should = scripts[path];
      if (should && this.paths.indexOf(path) === -1) this.paths.push(path);
    }
    return this.fetch_paths();
  };

  Require.prototype.fetch_paths = function() {
    var path, paths, _i, _len, _ref;
    paths = [];
    _ref = this.paths;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      if (this.loaded_paths.indexOf(path) === -1) {
        paths.push(path.replace(/\//, '!SEP!'));
      }
    }
    return $.ajax({
      url: "/js/" + (paths.join('/')),
      success: __bind(function(code) {
        return this.process(paths);
      }, this)
    });
  };

  Require.prototype.num_loaded_paths = function() {
    return this.loaded_paths.length + this.error_paths.length;
  };

  Require.prototype.process = function(paths) {
    var path, _i, _len;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.loaded_paths.indexOf(path) === -1) this.loaded_paths.push(path);
    }
    if (this.num_loaded_paths() === this.paths.length) return this.finish();
  };

  Require.prototype.finish = function() {
    var success;
    if (this.error_paths.length === this.paths.length) {
      success = false;
    } else {
      success = true;
    }
    return this.callback.call(this.scripts, success, {
      errors: this.error_paths.length
    });
  };

  return Require;

})();

window.require_js = __bind(function(scripts, callback) {
  return window.require_js = new Require(scripts, callback).require;
}, this);
