require_js {
  underscore: true
  constants: true
  keyboard: true
  page: true
  status: true
  manager: true
}, (success)->
  $ ->
    window.flux_type = new FluxType $('#application')

class FluxType
  constructor: (@$container)->
    @drawUI()

  drawUI: =>
    @status = new Status this

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

