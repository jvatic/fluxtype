class Manager
  constructor: (@base)->
    # iPad support (tap header to enable keyboard)
    @$hidden_input = ($ "<textarea type='text' class='hidden-input' value='Q'></textarea>").prependTo @base.$container

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

    space = @base.page.current_space
    if space && space.match(e.charCode)
      space.hit()
      @base.page.nextSpace()
    else if space
      space.miss(e.charCode)

  processKeyDown: (e)=>
    @base.keyboard.selectKey e.charCode, e.keyCode

    if _.include TOUCHY_KEYS, e.keyCode
      e.preventDefault()

    if _.include [KEYS.BACKSPACE], e.keyCode
      space = @base.page.current_space
      space.match e.keyCode

  processKeyUp: (e)=>
    @base.keyboard.deselectKey e.charCode, e.keyCode
