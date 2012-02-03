require_js {
  underscore: true
  helpers: true
  constants: true
  keyboard: true
  keyboard_row: true
  keyboard_key: true
  page: true
  manager: true
}, (success)->
  $ ->
    window.flux_type = new FluxType $('#application')

class FluxType
  constructor: (@$container)->
    @drawUI()

  drawUI: =>
    @page = new Page this, {
      width: @$container.width() - 100
      height: 160
      left: 50
      top: 20
    }

    @keyboard = new Keyboard this, {
      width: @$container.width() - 100
      height: 320
    }

    @manager = new Manager this

  defaultText: (callback)=>
    $.ajax {
      url: '/default_text'
      success: (text)=>
        callback text
    }

