class KeyboardRow
  constructor: (@keyboard, @row, @index)->
    @$container = @keyboard.$container
    @shifted_keys = @keyboard.shifted_keys[@index]

    @keys = _.map @row, (key, index)=> new KeyboardKey(this, key, index)

    $("<div class='clear'></div>").insertAfter(_.last(@keys).element)

  processCode: (codes, e)=>
    _.each @keys, (key)=> key.processCode(codes, e)

