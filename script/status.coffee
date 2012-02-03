class Status
  constructor: (@base)->
    @hits = []
    @misses = []

    @last_hit_at = null
    @word_index  = 0
    @word_length = 5
    @hit_speeds  = []
    @hit_speed_index = 0
    @wpms        = []
    @wpm_buffer  = 3

    @$container = ($ "<div class = 'status-container'></div>").appendTo @base.$container
    @$hits      = ($ "<div class = 'status-hits'>0.0</div>").appendTo @$container
    @$misses    = ($ "<div class = 'status-misses'>0.0</div>").appendTo @$container
    @$wpm       = ($ "<div class = 'status-wpm'>0.0</div>").appendTo @$container
    @$accuracy  = ($ "<div class = 'status-accuracy'>100</div>").appendTo @$container

  update: =>
    @$hits.text @hits.length
    @$misses.text @misses.length

    wpms = _.rest(@wpms, Math.min(@wpms.length-@wpm_buffer, @wpms.length-1))
    wpm_avg = ((_.inject wpms, ((sum, wpm)=> sum + wpm), 0) / wpms.length) || 0
    @$wpm.text wpm_avg.toFixed(2)

    accuracy = ((@hits.length - @misses.length) / (@hits.length + @misses.length)) * 100
    @$accuracy.text accuracy.toFixed(2)

  recordHit: (page_space)=>
    last_hit_at    = @last_hit_at
    current_hit_at = new Date
    @last_hit_at   = current_hit_at

    @hit_speeds.push (current_hit_at - last_hit_at)/1000
    hits = _.rest(@hit_speeds, @hit_speed_index)
    if hits.length == @word_length
      @hit_speed_index = @hit_speeds.length
      time = (_.inject hits, ((sum, time)=> sum += time), 0)
      speed = 60/time
      @wpms.push speed

    @hits.push page_space
    @update()

  recordMiss: (page_space)=>
    @misses.push page_space
    @update()
