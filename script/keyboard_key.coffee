class KeyboardKey
  constructor: (@row, @key, @index)->
    @init_vars()
    @init_keys()

  init_vars: =>
    @keyboard = @row.keyboard
    @shifted_key = @row.shifted_keys[@index] || @key

    @$container = @row.$container
    @html = "<div class='key'>#{@key}</div>"
    @element = $(@html).appendTo @$container

    if @key and @key.length == 1
      @charCodes = [@key.charCodeAt(0), @shifted_key.charCodeAt(0)]
    else
      @charCodes = []

    @keyCodes = []

    for code, keys of @keyboard.key_codes
      @keyCodes.push parseInt(code) if _.include(keys, @key)

    for code, keys of @keyboard.char_codes
      @charCodes.push parseInt(code) if _.include(keys, @key)

  keyType: =>
    return @type if @type

    for t in @keyboard.key_types
      @type = t if @key.match(t.type) or t.type == 'default'
      @type = t if @key.match(/(control|option|fn)/) and t.type == 'modifier'

      @keyCodes = t.codes if t.codes and t.type == @type.type
    @type

  ratio: => @keyType().ratio.split(':').map (i)=> parseFloat(i)
  fontRatio: =>
    r = @keyType().fontRatio
    return [0] unless r
    r = r.split(':').map (i)=> parseFloat(i)

  width: =>
    _.first(@ratio()) * @keyboard.scale

  height: =>
    _.last(@ratio()) * @keyboard.scale

  fontSize: =>
    ( @height() / _.first(@fontRatio()) ) * _.last(@fontRatio())

  init_keys: =>
    @element.css {
      width: @width() + 'px'
      height: @height() + 'px'
      fontSize: @fontSize() + 'px'
      'line-height': @height() + 'px'
    }

    unless @fontSize()
      @element.text ''
      @key = ''
      @shiftedKey = ''

  match_codes: (charCode, keyCode)=>
    (_.include @charCodes, charCode) or (_.include @keyCodes, keyCode)

  processCode: (codes)=>
    [charCode, keyCode] = codes
    if (_.include @keyCodes.merge(@charCodes), codes) and not( keyCode == 91 )
      @select()
    else
      @deselect()

  select: =>
    @element.addClass('active')

    $(window).bind 'keyup.deselect', (e)=>
      @deselect()
      $(window).unbind 'keyup.deselect'

    if @key == 'shift'
      @keyboard.shift()
      $(window).bind 'keyup.shift', (e)=>
        if @keyCodes.include(e.keyCode)
          @keyboard.unShift()
          $(window).unbind('keyup.shift')

  deselect: =>
    @element.removeClass('active')

  shift: =>
    @element.text @shiftedKey

  unShift: =>
    @element.text @key

