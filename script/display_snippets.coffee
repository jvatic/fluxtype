class DisplaySnippets
  constructor: (@display, @text)->
    @init_vars()
    @process_text()
    @process_rows()

  init_vars: =>
    @options = @display.options

    @text     = @sanitize @text
    @snippets = @text.split /(\n|\s{2,}|\.)/
    @rows     = []

  process_text: =>
    for string, index in @snippets
      if string.length > @options.max_row_chars
        @snippets[index]   = string.slice 0, @options.max_row_chars
        @snippets[index+1] = "#{string.slice @options.max_row_chars, string.length} #{@snippets[index+1]}"
        return @process_text()
      else
        @rows.push string

  process_rows: =>
    @snippets = []
    index = 0
    row_count = 0
    @rows.each (row)=>
      index++ if row_count > @options.max_rows

      @snippets[index] ||= ""
      @snippets[index] += row.trim().replace(/^(\.|[\r\n\s])+/, '').
                         trim().replace(/[\s\n\s]{2,}/, ' ')

  sanitize: (text)=>
    for char, index in text
      for replacementChar, charCodes of @charCodeMaps
        if charCodes.include(char.charCodeAt(0))
          text = text.replace_at(index, replacementChar)
    text

