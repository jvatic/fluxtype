class KeyboardRow
  constructor: (@keyboard, @row, @index)->
    @container = @keyboard.container
    @shiftedKeys = @keyboard.shiftedKeys[@index]

    @observer = @keyboard.observer

    @keys = @row.map (key, index)=> new KeyboardKey(this, key, index)

    $("<div class='clear'></div>").insertAfter(@keys.last().element)

  processCode: (codes, e)=>
    @keys.each (key)=> key.processCode(codes, e)

