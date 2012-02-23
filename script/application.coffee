require_js {
  underscore: true
  'store-js': true
  constants: true
  event: true
  keyboard: true
  page: true
  status: true
  manager: true
  hangman: true if window.location.href.match /hangman/
}, (success)->
  $ ->
    window.flux_type = new FluxType $('#application')

class FluxType
  constructor: (@$container)->
    @events = {
      page_init: new Event
      manager_init: new Event
    }

    @drawUI()

  drawUI: =>
    @status = new Status this

    @page = new Page this, {
      width: @$container.innerWidth()
      height: 160
      left: 50
      top: 20
    }
    @events.page_init.trigger()

    @keyboard = new Keyboard this, {
      width: @$container.width() - 100
      height: 320
    }

    if window.Hangman
      @hangman = new Hangman this

    @manager = new Manager this

  defaultText: (callback)=>
    $.ajax {
      url: '/default_text'
      success: (text)=>
        callback text
    }

