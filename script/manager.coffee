class Manager
  constructor: (@base)->
    # iPad support (tap header to enable keyboard)
    @$hidden_input = ($ "<textarea type='text' class='hidden-input' value='Q'></textarea>").prependTo @base.$container

    @events = {
      key_press: new Event
      key_down: new Event
      key_up: new Event
    }

    @base.events.manager_init.trigger this

    ($ document).bind 'keypress', @processKeyPress
    ($ document).bind 'keydown', @processKeyDown
    ($ document).bind 'keyup', @processKeyUp
    ($ document).bind 'focus', =>
      for keyCode in[KEYS.CONTROL, KEYS.COMMAND, KEYS.OPTION, KEYS.SHIFT]
        @base.keyboard.deselectKey null, keyCode

  processKeyPress: (e)=>
    # iPad: disable auto-caps when pressing space
    # disable input cursor from coming into view
    @$hidden_input.val('Q')

    return null if e.keyCode == KEYS.BACKSPACE

    e.charCode ||= e.which # IE compatibility

    @events.key_press.trigger e.charCode

  processKeyDown: (e)=>
    if _.include TOUCHY_KEYS, e.keyCode
      e.preventDefault()

    @events.key_down.trigger e.charCode, e.keyCode

  processKeyUp: (e)=>
    @events.key_up.trigger e.charCode, e.keyCode
