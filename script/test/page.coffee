TEXT = """
  Donec eget enim sit amet quam ullamcorper fermentum hendrerit in vel turpis.
  Donec libero rhoncus tortor sagittis consequat bibendum mauris consequat.
"""
# 21 words
# 150 typeables

module "Page"
  setup: ->
    @page = new Page {
      $container: ($ "#application")
      defaultText: (callback)->
        callback TEXT
    }, {
      width: 320
      height: 30
      left: 50
      top: 20
    }

test "#nextSpace selects next typeable space", ->
  equal @page.current_space.index, 0
  @page.nextSpace()
  equal @page.current_space.index, 1

test "#nextSpace re-draws text when no more spaces", ->
  @page.current_space = _.last(_.last(@page.rows).spaces)
  @page.nextSpace()
  equal @page.current_space.index, 0

test "#drawText populates spaces", ->
  @page.words = [{
    chars: [{ text: "A", code: 65, typeable: true }, { text: "a", code: 97, typeable: true }]
  },
  {
    chars: [{ text: "B", code: 66, typeable: true }, { text: "b", code: 98, typeable: true }]
  }]
  @page.word_index = 0

  @page.drawText()
  equal @page.rows[0].spaces[0].char.text, "A"
  equal @page.rows[0].spaces[1].char.text, "a"
  ok @page.rows[0].spaces[2].is_space
  equal @page.rows[0].spaces[3].char.text, "B"
  equal @page.rows[0].spaces[4].char.text, "b"
  ok @page.rows[0].spaces[5].is_space
  ok !@page.rows[0].spaces[6].typeable

test "#drawText buffers words", ->
  equal @page.rows[0].spaces[0].char.text, 'D'
  ok _.last(@page.rows[0].spaces).is_space, 'is_space'

  @page.drawText()
  equal @page.rows[0].spaces[0].char.text, 'e'
  equal @page.rows[0].spaces[7].char.text, 't'
  ok @page.rows[0].spaces[8].is_space
  ok !@page.rows[0].spaces[9].typeable
  ok !_.last(@page.rows[0].spaces).typeable

  @page.drawText()
  equal @page.rows[0].spaces[0].char.text, 'a'
  equal @page.rows[0].spaces[1].char.text, 'm'
  equal @page.rows[0].spaces[2].char.text, 'e'
  equal @page.rows[0].spaces[3].char.text, 't'
  ok @page.rows[0].spaces[4].is_space
  equal @page.rows[0].spaces[5].char.text, 'q'
  equal @page.rows[0].spaces[6].char.text, 'u'
  equal @page.rows[0].spaces[7].char.text, 'a'
  equal @page.rows[0].spaces[8].char.text, 'm'
  ok @page.rows[0].spaces[9].is_space
  ok !@page.rows[0].spaces[10].typeable

  @page.drawText()
  equal @page.rows[0].spaces[0].char.text, 'u'
  equal @page.rows[0].spaces[1].char.text, 'l'
  equal @page.rows[0].spaces[2].char.text, 'l'
  equal @page.rows[0].spaces[3].char.text, 'a'
  equal @page.rows[0].spaces[4].char.text, 'm'
  equal @page.rows[0].spaces[5].char.text, 'c'
  equal @page.rows[0].spaces[6].char.text, 'o'
  equal @page.rows[0].spaces[7].char.text, 'r'
  equal @page.rows[0].spaces[8].char.text, 'p'
  equal @page.rows[0].spaces[9].char.text, 'e'
  equal @page.rows[0].spaces[10].char.text, 'r'

  @page.drawText()
  ok @page.rows[0].spaces[0].is_space

test "#drawText fetches more text when no more words", ->
  @page.word_index = @page.words.length
  @page.drawText()
  equal @page.rows[0].spaces[0].char.text, "D"

module "Page.Row"
  setup: ->
    @row = new Page.Row {
      config: { num_columns: 10 }
    }, 0
    @next_row = new Page.Row {
      config: { num_columns: 10 }
    }, 0
    @row.page.rows = [@row, @next_row]

test "initialized with @page.config.num_columns spaces", ->
  equal @row.spaces.length, 10

test "#push(char, char, ...) assigns each char to a space", ->
  chars = [{ typeable: true, text: "A"}, { typeable: true, text: "B" }, { typeable: true, text: "C" }]
  @row.push(chars...)
  equal @row.spaces[0].char.text, "A"
  equal @row.spaces[1].char.text, "B"
  equal @row.spaces[2].char.text, "C"

test "#push(char, char, ...) inserts a space after last char", ->
  chars = [{ typeable: true, text: "A"}, { typeable: true, text: "B" }, { typeable: true, text: "C" }]
  @row.push(chars...)
  equal @row.spaces[0].char.text, "A"
  equal @row.spaces[1].char.text, "B"
  equal @row.spaces[2].char.text, "C"
  ok @row.spaces[3].is_space
  ok @row.space_index = 4

test "#push(char, char, ...) prepends a space to next row if no more spaces", ->
  @row.space_index = 9
  @row.push { typeable: true, text: "A" }
  ok @next_row.spaces[0].is_space

test "#push(char, char, ...) raises an exception if more chars than spaces", ->
  @row.space_index = 10
  raises =>
    @row.push { typeable: true, text: "X" }

test "#destroy removes each space.$element", ->
  $element = @row.spaces[0].$element
  $last_element = @row.spaces[9].$element
  @row.destroy()
  ok !$element.is(':visible')
  ok !$last_element.is(':visible')

module "Page.Row.Space"
  setup: ->
    page = {
      $container: ($ "#application")
      events: {
        hit: new Event
        miss: new Event
      }
      config:
        font_size: 18
    }
    row  = { space_index: 0 }
    @space = new Page.Row.Space page, row, 0
    @space.row.spaces = [@space]
    @space.page.rows  = [@space.row]

test "#setSpace makes it a typeable space", ->
  @space.setSpace()
  ok @space.typeable                     , 'is typeable'
  ok @space.$element.hasClass 'space'    , 'hasClass space'
  ok !@space.$element.hasClass 'empty'   , 'does not have empty class'
  equal @space.$element.html(), "&nbsp;" , 'displays a space char'
  equal @space.char_codes[0], 32         , 'responds to the space char code'
  equal @space.char_codes.length, 1      , 'only has one char code'

test "#set(char) makes it match char", ->
  char = {
    text: "A"
    code: 65
    typeable: true
  }

  @space.set(char)
  ok @space.typeable                          , 'is typeable'
  ok @space.$element.hasClass 'page-row-char' , 'has page-row-char class'
  ok !@space.$element.hasClass 'empty'        , 'does not have empty class'

test "#set(char) makes space not typeable if char is not typeable", ->
  char = {
    text: ""
    code: 63743
    typeable: false
  }

  @space.set(char)
  ok !@space.typeable, 'is not typeable'

test "#select adds selected class to $element", ->
  @space.select()
  ok @space.$element.hasClass 'active', 'has active class'

test "#deselect removes selected class from $element", ->
  @space.deselect()
  ok !@space.$element.hasClass 'active', 'does not have active class'

test "#hit adds hit class to $element", ->
  @space.hit()
  ok @space.$element.hasClass 'hit'   , 'has hit class'
  ok !@space.$element.hasClass 'miss' , 'does not have miss class'

test "#miss adds miss class to $element", ->
  @space.miss()
  ok @space.$element.hasClass 'miss' , 'has miss class'
  ok !@space.$element.hasClass 'hit' , 'does not have hit class'

test "#miss creates miss space with mistyped char", ->
  @space.miss(65) # A
  ok @space.miss_space                                         , 'has miss space'
  equal @space.miss_space.$element.text(), "A"                 , 'miss space has missed text'
  ok @space.miss_space.$element.hasClass 'page-row-miss-space' , 'miss space has page-row-miss-space class'
  ok @space.miss_space.$element.is(':visible')                 , 'miss space $element is visible'

test "#match matches @char.code", ->
  @space.char = {
    code: 65 # A
  }

  ok @space.match 65  , 'matches @char.code'
  ok !@space.match 97 , 'does not match other char code'

test "#match matches @char_codes if no @char", ->
  @space.char_codes = [65, 97] # A, a

  ok @space.match 65  , 'matches @char_codes[0]'
  ok @space.match 97  , 'matches @char_codes[1]'
  ok !@space.match 32 , 'does not match other char code'

test "#match doesn't match anything if @miss_space", ->
  @space.char_codes = [65, 97] # A, a
  @space.miss(83) # S
  ok !@space.match 65, 'does not match @char_codes[0]'
  ok !@space.match 97, 'does not match @char_codes[1]'

test "#match destroys @miss_space with backspace", ->
  @space.char_codes = [65, 97] # A, a
  @space.miss(83) # S
  miss_space = @space.miss_space
  ok miss_space                          , 'has @miss_space'
  @space.match(8) # backspace
  ok !@space.miss_space                  , '@miss_space is gone'
  ok !miss_space.$element.is(':visible') , '@miss_space $element is gone'

test "#isFirst adds 'first' class", ->
  @space.isFirst()
  ok @space.$element.hasClass 'first'

test "#isLast adds return char code", ->
  @space.char_codes = []
  @space.isLast()
  equal @space.char_codes[0], 13, 'has return (enter) char code'

