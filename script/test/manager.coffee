module "Manager"
  setup: ->
    @manager = new Manager {
      $container: ($ "#application")
      page: {
        nextSpace: => @space_index = (@space_index || 0) + 1
        current_space: {
          match: -> true
          hit: -> null
          miss: -> null
        }
      }
      status: {
        recordHit: => @hit_count = (@hit_count || 0) + 1
        recordMiss: => @miss_count = (@miss_count || 0) + 1
      }
      keyboard: {
        selectKey: (charCode, keyCode)=> @selected_key = keyCode
        deselectKey: => @selected_key = null
      }
    }

test "keypress within document deligates to page and status", ->
  e = $.Event "keypress"
  e.charCode = 97

  ($ document).trigger e
  equal @space_index, 1, '@base.page.nextSpace called'
  equal @hit_count, 1, '@base.state.recordHit called'

  @manager.base.page.current_space.match = -> false
  ($ document).trigger e
  equal @space_index, 1, '@base.page.nextSpace not called'
  equal @hit_count, 1, '@base.state.recordHit not called'
  equal @miss_count, 1, '@base.state.recordMiss called'

test "#processKeyPress does nothing for backspace", ->
  equal @manager.processKeyPress({ keyCode: 8 }), null

test "keydown within document deligates to keyboard", ->
  e = $.Event "keydown"
  e.keyCode = 13
  ($ document).trigger e

  equal @selected_key, 13, 'keyboard called with keyCode'

test "#precessKeyDown sends backspace to current space", ->
  @manager.base.page.current_space.match = (code)=> @space_code = code
  @manager.processKeyDown { keyCode: 8, preventDefault: -> null }
  equal @space_code, 8

test "keyup within document deligates to keyboard", ->
  @selected_key = 8
  e = $.Event "keyup"
  e.keyCode = @selected_key
  ($ document).trigger e

  equal @selected_key, null, 'keyboard called with keyCode'

