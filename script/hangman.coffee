class Hangman
  constructor: (@base)->
    [x, y, width, height] = [40, 300, 200, 200]
    @paper = new Raphael x, y, width, height

    @gallows = @paper.path """
      M0,#{height} L#{width},#{height} M60,#{height} L60,0 L180,0 L180,40
      M60,60 L120,0
    """

    @trapdoor = @paper.path "M#{width},#{height} L#{width-100},#{height}"
    @trapdoor.attr('stroke', '#ffffff').hide()

    @person = {
      head: @paper.circle(180, 54, 14).hide()
      torso: @paper.path("M180,68 L180, 120").hide()
      legs: {
        left: @paper.path("M180,120 L160,160").hide()
        right: @paper.path("M180,120 L200,160").hide()
      }
      arms: {
        left: @paper.path("M180,80 L160,100").hide()
        right: @paper.path("M180,80 L200,100").hide()
      }
    }

    @gameover = @paper.text(140, 80, "Game Over\nReload to play again!")
    @gameover.attr {
      'font-size': 10
      stroke: '#E21A10'
      'cursor': 'pointer'
    }
    @gameover.rotate -20
    @gameover.hide()

    @gameover.click -> window.location.reload()

    @game_status = @paper.text(90, 30, "Level 1\nScore: 0")
    @game_status.rotate(-45)

    @misses = 0
    @score  = 0
    @level  = 0
    @score  = 0

    @page_number  = -1
    @total_misses = 0

    @level_scale = {
      1: 4
      2: 3
      3: 2
      4: 1
      5: 0.5
      6: 0.25
      7: 0.125
    }

    @behaviour = [
      { e: @person.head,       thresh: 1 }
      { e: @person.torso,      thresh: 2 }
      { e: @person.arms.left,  thresh: 3 }
      { e: @person.arms.right, thresh: 4 }
      { e: @person.legs.left,  thresh: 5 }
      { e: @person.legs.right, thresh: 6 }
    ]

  miss: =>
    @misses += 1
    @total_misses += 1
    @process()

  upLevel: =>
    @page_number += 1
    return @updateGameStatus() if @level == 7 # highest level

    @level += 1
    @misses = 0

    # reset person
    @person.head.hide()
    @person.torso.hide()
    @person.legs.left.hide()
    @person.legs.right.hide()
    @person.arms.left.hide()
    @person.arms.right.hide()

    @updateGameStatus()

  updateGameStatus: =>
    @score = 24 + (@page_number * @level) - @total_misses
    @game_status.attr "text", "Level #{@level}\nScore: #{@score}"

  process: =>
    return if @dead

    @updateGameStatus()

    parts_shown = 0
    for part in @behaviour
      if @misses >= (part.thresh * @level_scale[@level])
        part.e.show()
        parts_shown += 1

    if parts_shown == @behaviour.length
      @personDie()
      @gameover.show()
      @dead = true

  personDie: =>
    @person.head.animate       { cy: 200 }, 400, 'bounce'
    @person.torso.animate      { path: "M180,200" }, 400
    @person.legs.left.animate  { path: "M180,200" }, 400
    @person.legs.right.animate { path: "M180,200" }, 400
    @person.arms.left.animate  { path: "M180,200" }, 400
    @person.arms.right.animate { path: "M180,200" }, 400

