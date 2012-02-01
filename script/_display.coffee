class Display
  constructor: (@app, @options)->
    @init_vars()
    @init_observer()
    @draw_ui()
    @bind_events()

  init_vars: =>
    @container = $("<section id='display_container'></section>").appendTo @app.container
    @app.container.append "<div class='clear'></div>"
    @input     = $("<textarea class='input_area'></textarea>").appendTo @app.container

    @chars = []

    @default_options = {
      font_size: 18
      padding: 4
      spacing: 1
      min_chars: 8
    }
    @options = $.extend @default_options, @options

    @charCodeMaps = {
      "'": [8217]
    }

    @options.size = @options.font_size + (@options.padding * 2) + (@options.spacing * 2)
    @options.max_chars = Math.floor (@options.width/@options.size) * (@options.height/@options.size)

  init_observer: =>
    @observer = new DisplayObserver this

  draw_ui: (text)=>
    @text = text
    @chars = []

    if text
      @snippets = @snippets_for text

      @next()
    else
      @app.default_text (text)=>
        @snippets = @snippets_for text

        @next()

  bind_events: =>
    @input.bind 'change', =>
      @currentChar = null
      @chars = []
      @draw_ui(@input.val())

  process_char: =>
    @currentChar.set 'inactive'
    @next()

  next: =>
    @currentChar = @chars[@chars.indexOf(@currentChar)+1]
    unless @currentChar
      @draw_snippet()
      return
    @currentChar.set 'active'

  pause: =>
    @currentChar.pulse('stop')

  update: (key, val)=>
    switch key
      when 'wpm'
        console.log val

  draw_snippet: =>
    return @draw_ui(@text) unless @snippets and @snippets.length > 0
    text = @snippets.shift().trim()

    @container.text ''
    @chars = []

    for char in text
      if char.match /\S/
        @chars.push new DisplayChar this, char, @chars.length
      else
        @chars.push new DisplayChar this, char, @chars.length, { whitespace: true }

    @chars.push new DisplayChar this, " ", @chars.length, { whitespace: true }

    @chars.first().set 'active'
    @currentChar = @chars.first()

  snippets_for: (text)=>
    text = @sanitize text
    if text.length >= @options.max_chars
      snippets = text.split /(\n|\s{2,}|\.)/
      full_snippets = []
      current_snippet = ""
      for s in snippets
        if s.length <= @options.min_chars or current_snippet.length + s.length <= @options.max_chars
          current_snippet += s
        else
          full_snippets.push current_snippet.replace(/^(\.|[\r\n\s])+/, '').
                                             trim().replace(/[\s\n\s]{2,}/, ' ')
          current_snippet = s
          full_snippets.push current_snippet
          current_snippet = ""

      full_snippets.flatten( (t)=> t.length < @options.min_chars )
    else
      [text]

  sanitize: (text)=>
    for char, index in text
      for replacementChar, charCodes of @charCodeMaps
        if charCodes.include(char.charCodeAt(0))
          text = text.replace_at(index, replacementChar)
    text

