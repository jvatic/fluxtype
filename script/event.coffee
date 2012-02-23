class Event
  constructor: ->
    @subscribers = []

  subscribe: (callback)=>
    unless (_.include @subscribers, callback)
      @subscribers.push callback

  trigger: (args...)=>
    for callback in @subscribers
      callback(args...)
