class Keyboard
  constructor: (@app, @config)->
    @config = $.extend {
      # default config
      width: 700
      height: 320
    }, @config

    @app.events.manager_init.subscribe (manager)=>
      manager.events.key_down.subscribe @selectKey
      manager.events.key_up.subscribe @deselectKey

    @$container = $("<div class='keyboard'></div>").appendTo @app.$container

    @key_types = [
      { type: 'default',    ratio: "9:10",      font_ratio: "15:7" },
      { type: 'tab',        ratio: "16:10",     font_ratio: "15:5" },
      { type: 'delete',     ratio: "16:10",     font_ratio: "15:5" },
      { type: 'return',     ratio: "18:10",     font_ratio: "15:5" },
      { type: 'caps lock',  ratio: "19:10",     font_ratio: "15:5" },
      { type: 'shift',      ratio: "24.5:10",   font_ratio: "15:5" },
      { type: 'modifier',   ratio: "9.5:10",    font_ratio: "15:4" },
      { type: 'command',    ratio: "11:10",     font_ratio: "16:4" },
      { type: 'space',      ratio: "57:10" }
    ]

    @scale = 4.0

    @keys = []
    @shifted_keys = []
    @key_codes = []

    @keys.push         ['`' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '0' , '-' , '=' , 'delete']
    @shifted_keys.push ['~' , '!' , '@' , '#' , '$' , '%' , '^' , '&' , '*' , '(' , ')' , '_' , '+' , 'delete']
    @key_codes.push    [192 , 49  , 50  , 51  , 52  , 53  , 54  , 55  , 56  , 57  , 48  , 189 , 187 , KEYS.BACKSPACE]

    @keys.push         ['tab'    , 'q' , 'w' , 'e' , 'r' , 't' , 'y' , 'u' , 'i' , 'o' , 'p' , '[' , ']' , '\\']
    @shifted_keys.push ['tab'    , 'Q' , 'W' , 'E' , 'R' , 'T' , 'Y' , 'U' , 'I' , 'O' , 'P' , '{' , '}' , '|']
    @key_codes.push    [KEYS.TAB , 81  , 87  , 69  , 82  , 84  , 89  , 85  , 73  , 79  , 80  , 219 , 221 , 220]

    @keys.push         ['caps lock'   , 'a' , 's' , 'd' , 'f' , 'g' , 'h' , 'j' , 'k' , 'l' , ';' , '\'' , 'return']
    @shifted_keys.push ['caps lock'   , 'A' , 'S' , 'D' , 'F' , 'G' , 'H' , 'J' , 'K' , 'L' , ':' , '"'  , 'return']
    @key_codes.push    [KEYS.CAPSLOCK , 65  , 83  , 68  , 70  , 71  , 72  , 74  , 75  , 76  , 186 , 222  , KEYS.RETURN]

    @keys.push         ['shift'    , 'z' , 'x' , 'c' , 'v' , 'b' , 'n' , 'm' , ',' , '.' , '/' , 'shift']
    @shifted_keys.push ['shift'    , 'Z' , 'X' , 'C' , 'V' , 'B' , 'N' , 'M' , '<' , '>' , '?' , 'shift']
    @key_codes.push    [KEYS.SHIFT , 90  , 88  , 67  , 86  , 66  , 78  , 77  , 188 , 190 , 191 , KEYS.SHIFT]

    @keys.push         ['fn'        , 'control'    , 'option'    , 'command'    , 'space'    , 'command'    , 'option']
    @shifted_keys.push _.last @keys
    @key_codes.push    [null        , KEYS.CONTROL , KEYS.OPTION , KEYS.COMMAND , KEYS.SPACE , KEYS.COMMAND , KEYS.OPTION]

    @rows = _.map @keys, (row, index)=> new Keyboard.Row this, row, index
    @$container.append ($ "<div class='clear'></div>")

  shiftKeys: =>
    for row in @rows
      for key in row.keys
        key.shift()

  unShiftKeys: =>
    for row in @rows
      for key in row.keys
        key.unShift()

  selectKey: (charCode, keyCode)=>
    for row in @rows
      for key in row.keys
        if key.match(charCode, keyCode)
          key.select()

  deselectKey: (charCode, keyCode)=>
    for row in @rows
      for key in row.keys
        if key.match(charCode, keyCode)
          key.deselect()

  class @Row
    constructor: (@keyboard, keys, @index)->
      shifted_keys = @keyboard.shifted_keys[@index]
      key_codes    = @keyboard.key_codes[@index]

      @keys = _.map keys, (key, index)=>
        code = key_codes[index]

        key_class = Keyboard.Row.Key
        key_class = Keyboard.Row.ShiftKey if code == KEYS.SHIFT
        key_class = Keyboard.Row.CapsLockKey if code == KEYS.CAPSLOCK

        new key_class @keyboard, this, key, shifted_keys[index], code, index
      _.first(@keys).isFirst()

    class @Key
      constructor: (@keyboard, @row, @text, @shifted_text, @code, @index)->
        @$element = ($ "<div class='key'>#{@text}</div>").appendTo @keyboard.$container

        @_initType()
        @_calibrate()

        @shifted  = false
        @selected = false

      match: (charCode, keyCode)=>
        @code == keyCode

      shift: =>
        @shifted = true
        @$element.text @shifted_text

      unShift: =>
        @shifted = false
        @$element.text @text

      select: =>
        @$element.addClass 'active'
        @selected = true

      deselect: =>
        @$element.removeClass 'active'
        @selected = false

      isFirst: =>
        @$element.addClass 'clear'

      _initType: =>
        for t in @keyboard.key_types
          @type = t if @text.match(t.type) || t.type == 'default'
          @type = t if @text.match(/(control)|(option)|(fn)/) && t.type == 'modifier'

      _calibrate: =>
        ratio      = @_parseRatio @type.ratio
        font_ratio = if @type.font_ratio then @_parseRatio @type.font_ratio else [0, 0]

        width  = ratio[0] * @keyboard.scale
        height = ratio[1] * @keyboard.scale

        font_size = (height / font_ratio[0]) * font_ratio[1]

        @$element.css
          width:         width     + 'px'
          height:        height    + 'px'
          fontSize:      font_size + 'px'
          'line-height': height    + 'px'

        unless font_size
          @$element.text ''
          @text = ''
          @shifted_text = ''

      _parseRatio: (string)=>
        _.map string.split(':'), (i)=> parseFloat(i)

    class @ShiftKey extends @Key
      constructor: ->
        super

        @keyboard.shift_key = this

      select: =>
        super

        if @keyboard.caps_lock_key.selected
          @keyboard.unShiftKeys()
        else
          @keyboard.shiftKeys()

      deselect: =>
        super

        if @keyboard.caps_lock_key.selected
          @keyboard.shiftKeys()
        else
          @keyboard.unShiftKeys()

    class @CapsLockKey extends @Key
      constructor: ->
        super

        @keyboard.caps_lock_key = this

      select: =>
        super

        if @keyboard.shift_key.selected
          @keyboard.unShiftKeys()
        else
          @keyboard.shiftKeys()

      deselect: =>
        super

        if @keyboard.shift_key.selected
          @keyboard.shiftKeys()
        else
          @keyboard.unShiftKeys()

