class Page
  constructor: (@base, @config)->
    @_initTemplate()

    @rows = []

    default_config = {
      font_size: 18
      padding: 4
      spacing: 3
    }
    @config = $.extend default_config, @config

    @config.space_size  = @config.font_size + (@config.padding * 2) + (@config.spacing * 2)
    @config.num_columns = Math.floor (@$container.innerWidth()/@config.space_size)+1
    @config.num_rows    = Math.floor @config.height/@config.space_size
    @config.max_chars   = @config.num_columns * @config.num_rows

    @_initText()

  resetRows: =>
    _.each @rows, (row)=> row.destroy()
    @rows = _.map [0..@config.num_rows], => new Page.Row this

  drawText: =>
    @resetRows()
    @word_index = 0 if @word_index >= @words.length
    _.each @rows, (row, row_index)=>
      for word, word_index in (_.rest @words, @word_index)
        if _.rest(row.spaces, row.space_index).length >= word.chars.length
          row.push word.chars...
          @word_index += 1
        else
          break

  _initText: (text)=>
    unless text
      return @base.defaultText (text)=>
        @_initText text

    @words = _.map text.split(/[\s\n\t]+/), (word)=> new Page.Word this, word
    @word_index = 0

    @drawText()

  _initTemplate: =>
    element_id_index = {
      outer_container: 'page-outer-container'
      container: 'page-container'
    }

    html = """
    <div id='#{element_id_index.outer_container}'>
      <div id='#{element_id_index.container}'>
      </div>
      <div class='clear'></div>
    </div>
    """

    ($ html).appendTo @base.$container

    @$container = ($ "##{element_id_index.container}")

  class @Row
    constructor: (@page)->
      @spaces = _.map [0..@page.config.num_columns], => new Page.Row.Space @page, this
      (_.first @spaces).isFirst()

      @space_index = 0

    push: (chars...)=>
      _.each chars, (char, char_index)=>
        @spaces[@space_index].set char
        @space_index += 1
      @space_index += 1

    destroy: =>
      _.each @spaces, (space)=> space.$element.remove()

    class @Space
      constructor: (@page, @row)->
        @$element = ($ "<div class='page-row-space empty'>&nbsp;</div>").appendTo @page.$container

        @$element.css
          width: @page.config.font_size

      set: (@char)=>
        @$element.text @char.text
        @$element.addClass 'page-row-char'

        if @char.typeable
          @$element.removeClass 'empty'

      isFirst: =>
        @$element.addClass 'first'

  class @Word
    constructor: (@page, @text)->
      @chars = _.map @text.split(''), (char)=> new Page.Word.Char @page, this, char

    class @Char
      @TYPEABLE_MATCHER = /^[-a-z0-9_~`!@#$%^&*\(\)-+=\|\\\}\{\[\]"':;?\/><,.\s\t]$/i
      constructor: (@page, @word, @text)->
        @typeable = @text.match(Page.Word.Char.TYPEABLE_MATCHER) != null
