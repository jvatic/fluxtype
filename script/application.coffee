require_js {
  helpers: true
  constants: true
  keyboard: true
  keyboard_row: true
  keyboard_key: true
  display: true
  display_char: true
  display_observer: true
}, (success)->
  $ ->
    $.FluxType = new FluxType $('#application')

class FluxType
  constructor: (@container)->
    @init_vars()
    @draw_ui()

  init_vars: =>
    @canvas_config = {
      width: @container.width()
      height: @container.height()
      node: @container.get(0)
    }

    @snipets = {}

  draw_ui: =>
    @display  = new Display this, {
      width: @container.width() - 100
      height: 160
      left: 50
      top: 20
    }

    @keyboard = new Keyboard this, {
      width: @container.width() - 100
      height: 320
    }

  default_text: (callback)=>
    if @snipets.default_text
      callback.call null, @snipets.default_text
    else
      $.ajax {
        url: '/default_text'
        success: (text)=>
          @snipets.default_text = text
          callback.call null, text
      }
    null
