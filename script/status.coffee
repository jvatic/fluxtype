class Status
  constructor: (@base)->
    @hits = []
    @misses = []

    @session_date = (new Date).toString().replace(/(\d{2}\s\d{4}).*$/, "$1")

    @saved_data = new Store 'Status', {
      hit_speeds: []
      hit_speed_index: 0
      wpms: []
      hit_counts: {}
      miss_counts: {}
    }

    @hit_counts  = @saved_data.get('hit_counts' )
    @hit_counts[@session_date] ||= 0
    @miss_counts = @saved_data.get('miss_counts')
    @miss_counts[@session_date] ||= 0

    @last_hit_at = null
    @word_index  = 0
    @word_length = 5
    @hit_speeds  = @saved_data.get('hit_speeds')
    @hit_speed_index = @saved_data.get('hit_speed_index')
    @wpms        = @saved_data.get('wpms')
    @wpm_buffer  = 3

    @$container = ($ "<div class='status-container'></div>").appendTo @base.$container
    @$hits      = ($ "<div class='status-hits'>0.0</div>").appendTo @$container
    @$misses    = ($ "<div class='status-misses'>0.0</div>").appendTo @$container
    @$wpm       = ($ "<div class='status-wpm'>0.0</div>").appendTo @$container
    @$accuracy  = ($ "<div class='status-accuracy'>100</div>").appendTo @$container

    @update()

  update: =>
    hit_count = @hit_counts[@session_date]
    miss_count = @miss_counts[@session_date]

    @$hits.text hit_count
    @$misses.text miss_count

    @$wpm.text @wpmBufferAvg().toFixed(2)

    accuracy = ((hit_count - miss_count) / (hit_count + miss_count)) * 100
    accuracy ||= 0
    @$accuracy.text accuracy.toFixed(2)

  wpmBufferAvg: =>
    wpms = _.rest(@wpms, Math.min(@wpms.length-@wpm_buffer, @wpms.length-1))
    @wpmAvg wpms

  wpmAvg: (wpms)=>
    ((_.inject wpms, ((sum, wpm)=> sum + wpm), 0) / wpms.length) || 0

  recordHitSpeed: (seconds)=>
    @hit_speeds.push seconds
    @saved_data.set('hit_speeds', @hit_speeds)
    hits = _.rest(@hit_speeds, @hit_speed_index)
    if hits.length == @word_length
      @hit_speed_index = @hit_speeds.length
      @saved_data.set('hit_speed_index', @hit_speed_index)
      time = (_.inject hits, ((sum, time)=> sum += time), 0)
      speed = 60/time
      @wpms.push speed
      @saved_data.set('wpms', @wpms)

  recordHit: (page_space)=>
    last_hit_at    = @last_hit_at
    current_hit_at = new Date
    @last_hit_at   = current_hit_at

    @recordHitSpeed (current_hit_at - last_hit_at) / 1000

    @hits.push page_space
    @hit_counts[@session_date] += 1
    @saved_data.set('hit_counts', @hit_counts)
    @update()

  recordMiss: (page_space)=>
    @misses.push page_space
    @miss_counts[@session_date] += 1
    @saved_data.set('miss_counts', @miss_counts)
    @update()
