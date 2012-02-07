module "Status"
  setup: ->
    Store.clear()
    @status = new Status {}

test "records hit", ->
  expect 1

  assertDifference @status, 'hits.length', 1, (finish)=>
    @status.recordHit {}
    finish()

test "records miss", ->
  expect 1

  assertDifference @status, 'misses.length', 1, (finish)=>
    @status.recordMiss {}
    finish()

test "records hit speeds", ->
  expect 1

  assertDifference @status, 'hit_speeds.length', 10, (finish)=>
    for n in [1..10]
      @status.recordHit {}
    finish()
  , "Status#hit_speeds is 10 for every 10 hits"

test "records wpms", ->
  expect 1

  assertDifference @status, 'wpms.length', 2, (finish)=>
    for n in [1..10]
      @status.recordHit {}
    finish()
  , "Status#wpms.length is 2 for every 10 hits"

test "#wpmAvg calculates wpm average", ->
  @status.wpm_buffer = 4

  # 2 words taking 5 seconds each
  for [1..10]
    @status.recordHitSpeed 1

  equal @status.wpmAvg(), 12, '2 words, 5 seconds each'

  # 2 more words, first taking 15 and 41 seconds respectivly
  for n in [1..10]
    @status.recordHitSpeed n

  equal @status.wpmAvg(), 7.375, '4 words, 12, 12, 4, and 1.5 seconds respectivly'

  # 1 more word at 6 seconds
  for [1..5]
    @status.recordHitSpeed 2
  equal @status.wpmAvg(), 5.875, '4 words (buffer), 12, 4, 1.5, and 6 seconds respectivly'
