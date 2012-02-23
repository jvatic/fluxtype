module 'Event'
  setup: ->
    @event = new Event

test "handles subscribtions", ->
  callback = ->
  @event.subscribe callback
  equal @event.subscribers.length, 1

test "calls subscribers when triggered", ->
  @callback_count = 0
  callback = => @callback_count += 1
  @event.subscribers = [callback, callback, callback]
  @event.trigger()
  equal @callback_count, 3

test "calls subscribers with all arguments passed to trigger", ->
  @callback_args_count = 0
  callback = (args...)=> @callback_args_count = args.length
  @event.subscribers = [callback]
  @event.trigger(1,2,3)
  equal @callback_args_count, 3
