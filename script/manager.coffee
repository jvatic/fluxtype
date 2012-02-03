class Manager
  @SPECIAL_KEYS = [8, 48]

  constructor: (@base)->
    ($ window).bind 'keypress', @processKey
    ($ window).bind 'keydown', @processSpecialKey

  processKey: (e)=>
    console.log e.keyCode
    space = @base.page.current_space
    if space && space.match(e.charCode)
      space.hit()
      @base.page.nextSpace()
    else
      space.miss(e.charCode)

  processSpecialKey: (e)=>
    if _.include Manager.SPECIAL_KEYS, e.keyCode
      space = @base.page.current_space
      space.match e.keyCode
