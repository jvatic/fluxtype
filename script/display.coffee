class Display
  constructor: (@app, @options)->
    @init_vars()
    @init_rows()
    @init_observer()
    @init_text()

  init_vars: =>
    @outer_container = $("<section id='display_outer_container'></section>").appendTo @app.container
    @container = $("<section id='display_container'></section>").appendTo @outer_container
    @outer_container.append "<div class='clear'></div>"
    #@input     = $("<textarea class='input_area'></textarea>").appendTo @app.container

    @rows = []

    @default_options = {
      font_size: 18
      padding: 4
      spacing: 3
      min_chars: 8
    }
    @options = $.extend @default_options, @options

    @charCodeMaps = {
      "'": [8217]
    }

    @options.size = @options.font_size + (@options.padding * 2) + (@options.spacing * 2)
    @options.num_columns = Math.floor (@container.innerWidth()/@options.size)+1
    @options.num_rows = Math.floor @options.height/@options.size

    @options.max_chars = @options.num_columns * @options.num_rows

  init_rows: =>
    @rows.each (row)=> row.destroy()
    @rows = [0..@options.num_rows].map => new DisplayRow @app, this

  init_observer: => @observer = new DisplayObserver this

  init_text: (text)=>
    text ||= "\"Vut rhoncus 'lectus' mattis! Porta risus integer \"phasellus\"nunc ac tincidunt enim vel\" porta eros nunc, adipiscing scelerisque egestas sed ridiculus?\" Mauris porttitor nunc? 'Nascetur montes', dis diam eu purus, mus augue magna eu augue dignissim tristique odio placerat dapibus scelerisque lectus integer ut placerat enim, placerat est, urna et eu, dignissim nec nunc integer augue aliquam magna. Turpis ac sagittis adipiscing risus, risus? Nisi cras nec, magna tincidunt augue a duis! Ut amet, scelerisque, mauris, porta urna, elit scelerisque? {Habitasse} montes? Odio in? Nisi lectus mus et ultrices turpis eu porttitor in. Cursus platea, tempor integer diam! Phasellus? Nec, lectus ut phasellus enim, ac? Sit proin proin! Non, natoque, sagittis pulvinar, mid rhoncus, tristique enim platea purus et, nec."
    if text
      text = (text.replace /([\W"']+)/gi, "<$1>").replace(/(\w+)/g, "<word>$1</word>")
    else
      return @app.default_text (text)=>
        @init_text text

    @process_words (@split_words text)

  split_words: (text)=>
    first_punctuation = (text.match /^<\W+>/ || []).first()
    last_punctuation  = (text.match /<\W+>$/ || []).first()
    [first_punctuation, (text.match /(<[\s\n\t]\W+>)*<word>\w+<\/word>(<\W+[\s\n\t]>)*/g) || [], last_punctuation]

  process_words: (words)=>
    words = words.flatten()
    next_punctuation = ''
    words = words.map (word)=>
      punctuations_before: ((word.match /<[\s\n\t]\W+>/g) || []).join(' ')
      punctuations_after:  ((word.match /<\W+[\s\n\t]>/g) || []).join(' ')

      word:                ((word.match /<word>\w+<\/word>/g) || (word.match /<\W+>/g) || []).join(' ')

    words.each (item, index)=>
      if m = item.word.match /^<\W+>$/
        words[index] = null
        if words[index+1]
          words[index+1].punctuations_before += (m.join ' ')
        else if words[index-1]
          words[index-1].punctuations_after += (m.join ' ')

    @row_index = 0
    @space_index = 0
    @words = words.flatten().map (item, index)=>
      new DisplayWord @app, this, item.punctuations_before, item.word, item.punctuations_after

class DisplayWord
  constructor: (@app, @display, punctuations_before, word, punctuations_after)->
    @word = (word.replace /<\/?word>/g, '')
    @punctuation_before = ((punctuations_before.replace /<|>|\s/g, '').match /\W/g) || []
    @punctuation_after  = ((punctuations_after.replace /<|>|\s/g, '').match /\W/g) || []

    @draw_word()

  draw_word: =>
    @word_length = @punctuation_before.length + @word.length + @punctuation_after.length
    @next_row()
    return unless @row

    if @punctuation_before.length == 0
      @punctuation_before = null
    if @punctuation_after.length == 0
      @punctuation_after = null

    @chars = [@punctuation_before, @word.split(''), @punctuation_after].flatten().map (char)=>
      space = @row.spaces[@display.space_index]
      return unless space
      (new DisplayChar @display, space, char, { is_punctuation: (char == @punctuation_before || char == @punctuation_after) })

    @display.space_index += 1

  next_row: =>
    @row = @display.rows[@display.row_index]

    unless @row
      return null

    unless @row.spaces[@display.space_index+@word_length]
      @display.row_index += 1
      @display.space_index = 0
      return @next_row()

class DisplayRow
  constructor: (@app, @display, @options=@display.options)->
    @spaces = [0..@options.num_columns].map => new DisplaySpace @app, this
    @spaces.first().isFirst()

  destroy: =>
    @spaces.each (space)=> space.element.remove()

class DisplaySpace
  constructor: (@app, @row, @display=@row.display, @options=@display.options)->
    @element = $("<div class='display_space'>&nbsp;</div>").appendTo @display.container

    @element.css {
      width: @options.font_size
    }

  isFirst: =>
    @element.addClass('first')

class DisplayChar
  constructor: (@display, @space, @char, @options)->
    @display.space_index += 1

    @element = @space.element.addClass('display_char')
    @element.text @char

    if @options.is_punctuation
      @element.addClass 'punctuation'
