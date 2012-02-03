class Manager
  @SPECIAL_KEYS = [KEYS.BACKSPACE]

  constructor: (@base)->
    ($ window).bind 'keypress', @processKeyPress
    ($ window).bind 'keydown', @processKeyDown
    ($ window).bind 'keyup', @processKeyUp

  processKeyPress: (e)=>
    space = @base.page.current_space
    if space && space.match(e.charCode)
      space.hit()
      @base.page.nextSpace()
    else
      space.miss(e.charCode)

  processKeyDown: (e)=>
    @base.keyboard.selectKey e.charCode, e.keyCode

    if _.include TOUCHY_KEYS, e.keyCode
      e.preventDefault()

    if _.include Manager.SPECIAL_KEYS, e.keyCode
      space = @base.page.current_space
      space.match e.keyCode

  processKeyUp: (e)=>
    @base.keyboard.deselectKey e.charCode, e.keyCode
