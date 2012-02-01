class DisplayChar
  constructor: (@display, @char, @index, @options={})->
    @init_vars()
    @init_codes()
    @init_element()

  init_vars: =>
    @default_options = {
      class: {
        active: 'active'
      }
    }
    @options = $.extend @default_options, @options

  init_element: =>
    @element = $(@html()).appendTo @display.container

    # First char on line other than line one
    if @position().left == 0 and @display.chars.length != 0
      index = @display.chars.length
      word_break = @display.chars.prevUntil (char)=>
        char.char.match /^\s*$/
      , index
      if word_break # end-of-line-space
        word_break.element.next().addClass('clear')
        word_break.keyCodes.push KEYS.RETURN

  init_codes: =>
    @charCodes  = [@char.charCodeAt(0)]
    @keyCodes   = []

  match_codes: (charCode, keyCode)=>
    @charCodes.include(charCode) or @keyCodes.include(keyCode)

  html: =>
    if @options.whitespace
      @whitespace_html()
    else
      "<div class='char'>#{@char}</div>"

  position: =>
    {
      top: @element.position().top
      left: @element.position().left
    }

  set: (status)=>
    switch status
      when 'active'
        @pulse 'start'
      when 'inactive'
        @pulse 'stop'

  prev: =>
    @display.chars[@index-1]

  next: null

  pulse: (status)=>
    if status == 'start'
      @pulseInterval = setInterval =>
        @element.removeClass(@options.class.active)
        @pulseTimeout = setTimeout =>
          @element.addClass(@options.class.active)
        , 50
      , 500
    else
      clearTimeout @pulseTimeout
      clearInterval @pulseInterval
      @element.removeClass(@options.class.active).addClass('old')

  whitespace_html: =>
    space = "&nbsp;"
    if @char.match /\t/
      space = space.times(4)
    else
      space = space.times(2)

    "<div class='char space'>#{space}</div>"


