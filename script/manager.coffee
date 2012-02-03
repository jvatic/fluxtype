class Manager
  constructor: (@base)->
    ($ window).bind 'keypress', @processKey

  processKey: (e)=>
    space = @base.page.current_space
    if space && space.match(e.charCode)
      space.hit()
      @base.page.nextSpace()
    else
      space.miss(e.charCode)
