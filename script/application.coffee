require_js {
  underscore: true
  helpers: true
  constants: true
  keyboard: true
  keyboard_row: true
  keyboard_key: true
  page: true
}, (success)->
  $ ->
    window.flux_type = new FluxType $('#application')

class FluxType
  constructor: (@$container)->
    @initVars()
    @drawUI()

  initVars: =>
    @snipets = {}

  drawUI: =>
    @page = new Page this, {
      width: @$container.width() - 100
      height: 160
      left: 50
      top: 20
    }
    return

    @keyboard = new Keyboard this, {
      width: @$container.width() - 100
      height: 320
    }

  defaultText: (callback)=>
    if @snipets.default_text
      callback @snipets.default_text
    else
      $.ajax {
        url: '/default_text'
        success: (text)=>
          @snipets.default_text = text
          callback text
      }
    null

