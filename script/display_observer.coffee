class DisplayObserver
  constructor: (@display)->
    @init_vars()
    @bind_events()

  init_vars: =>
    @durations = []
    @velocity = 0

  prevent_defaults: (e)=>
    e.preventDefault()
    e.stopImmediatePropagation()

  bind_events: =>
    $(window).bind 'keydown', (e)=> @display.app.keyboard.processCode([e.charCode, e.keyCode], e)
    $(window).bind 'keypress', @process_key

  process_key: (e)=>
    if @display.currentChar and @display.currentChar.match_codes(e.charCode, e.keyCode)
      @prevent_defaults(e)
      @display.process_char()
      return

  pause: =>
    @display.pause()


