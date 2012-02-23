TEXT = """
  The quick brown fox jumps over the lazy dog
"""

module "Core"
  setup: ->
    @app = new FluxType ($ '#application')

    $.mockjax {
      url: '/default_text'
      responseText: TEXT
      responseTime: 0
    }

  teardown: ->
    $.mockjaxClear()

test "Compenents initialize", ->
  expect 4
  return unless @app

  ok @app.status   , 'Status'
  ok @app.page     , 'Page'
  ok @app.keyboard , 'Keyboard'
  ok @app.manager  , 'Manager'

asyncTest "#defaultText calls /default_text endpoint", ->
  @app.defaultText (text)->
    equal text, TEXT
    start()

