module "Manager"
  setup: ->
    @manager = new Manager {
      $container: ($ "#application")
      events: {
        manager_init: new Event
      }
      page: {
        current_space: {
          match: -> true
          hit: -> null
          miss: -> null
        }
      }
      keyboard: {
        selectKey: (charCode, keyCode)=> @selected_key = keyCode
        deselectKey: => @selected_key = null
      }
    }

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

