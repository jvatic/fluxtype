class Require
  constructor: (@scripts, @callback)->
    @init_vars()
    @fetch_paths()

  init_vars: =>
    @paths = []
    for path, should of @scripts
      @paths.push path if should and @paths.indexOf(path) == -1

    @loaded_paths   = []
    @error_paths    = []
    @embeded_paths  = []

    @container = $("#javascript")

  require: (scripts, callback)=>
    throw "Expected: (scripts, callback)" unless scripts and callback
    @callback = callback
    for path, should of scripts
      @paths.push path if should and @paths.indexOf(path) == -1

    @fetch_paths()

  fetch_paths: =>
    paths = []
    for path in @paths
      paths.push path.replace(/\//, '!SEP!') if @loaded_paths.indexOf(path) == -1

    $.ajax {
      url: "/js/#{ paths.join('/') }"
      success: (code)=> @process(paths)
    }

  num_loaded_paths: => @loaded_paths.length + @error_paths.length

  process: (paths)=>
    for path in paths
      @loaded_paths.push path if @loaded_paths.indexOf(path) == -1

    if @num_loaded_paths() == @paths.length
      @finish()

  finish: =>
    if @error_paths.length == @paths.length
      success = false
    else
      success = true

    @callback.call @scripts, success, { errors: @error_paths.length }

window.require_js = (scripts, callback)=>
  window.require_js = new Require(scripts, callback).require
