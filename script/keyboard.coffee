class Keyboard
  constructor: (@app, @config)->
    @config = $.extend {
      # default config
      width: 700
      height: 320
    }, @config

    @$container = $("<div class='keyboard'></div>").appendTo @app.$container

    @key_types = [
      { type: 'default',    ratio: "9:10",      fontRatio: "15:7" },
      { type: 'tab',        ratio: "16:10",     fontRatio: "15:5", codes: [9] },
      { type: 'delete',     ratio: "16:10",     fontRatio: "15:5", codes: [8] },
      { type: 'return',     ratio: "18:10",     fontRatio: "15:5", codes: [13] },
      { type: 'caps lock',  ratio: "19:10",     fontRatio: "15:5", codes: [20] },
      { type: 'shift',      ratio: "24.5:10",   fontRatio: "15:5", codes: [16] },
      { type: 'modifier',   ratio: "9.5:10",    fontRatio: "15:4" },
      { type: 'command',    ratio: "11:10",     fontRatio: "16:4" },
      { type: 'space',      ratio: "57:10", codes: [32] },
    ]

    @scale = 4.0

    @keys = []
    @shifted_keys = []

    @keys.push         ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete']
    @shifted_keys.push ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'delete']

    @keys.push         ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\']
    @shifted_keys.push ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|']

    @keys.push         ['caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'return']
    @shifted_keys.push ['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'return']

    @keys.push         ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift']
    @shifted_keys.push ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift']

    @keys.push         ['fn', 'control', 'option', 'command', 'space', 'command', 'option']
    @shifted_keys.push _.last @keys

    @key_codes = {
      61: ['=']
      187: ['=']
      186: [';']
      188: [',']
      189: ['-']
      190: ['.']
      191: ['/']
      192: ['`']
      219: ['[']
      220: ['\\']
      221: [']']
      222: ['\'']
    }

    @char_codes = {
      8217: ['\'']
    }

    @rows = _.map @keys, (row, index)=> new KeyboardRow(this, row, index)

  processCode: (codes, e)=>
    _.each @rows, (row)=> row.processCode(codes, e)

  shift: =>
    _.each @rows, (row)=> row.keys.each (key)=> key.shift()

  unShift: =>
    _.each @rows, (row)=> row.keys.each (key)=> key.unShift()

