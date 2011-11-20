class Mantra.Entity
  constructor: (@game, coords = { x: 0, y: 0 }) ->
    [@x, @y] = [coords.x, coords.y]
    @remove_from_world = false
    @screen            = null
    @timers            = []

  update: ->
    # timer.tick() for timer in @timers

  draw: ->
    if @game.draw_collision_boxes
      Mantra.Canvas.rectangle context,
        x: @x - @colx,  y: @y - @coly,
        w: @colw, h: @colh
        hollow: true
        style:  'white'

  cull:   -> null

  addTimer: (timer) -> @timers.push timer

  outsideScreen: ->
    if @game.center_coordinates
      (@x > @game.halfSurfaceWidth || @x < -(@game.halfSurfaceWidth) || @y > @game.halfSurfaceHeight || @y < -(@game.halfSurfaceHeight))
    else
      (@x > @game.canvas.width || @x < -(@game.canvas.width) || @y > @game.canvas.height || @y < -(@game.canvas.height))

  listen: (type, callback) ->
    Mantra.EventManager.instance.listen(type, this, callback)

  s_coords: ->
    "#{@x.toString()[0..5]}, #{@y.toString()[0..5]}"

  drawSpriteCentered: (context) ->
    return unless @sprite?
    x = @x - @sprite.width/2
    y = @y - @sprite.height/2
    context.drawImage(@sprite, x, y)

  setCoords: (coords) ->
    @x = coords.x
    @y = coords.y

  collidesWith: (entity) ->
    @isCollide @, entity

  isCollide: (a, b) ->
    !(
      ((a.y + a.colh) < (b.y)) ||
      (a.y > (b.y + b.colh)) ||
      ((a.x + a.colw) < b.x) ||
      (a.x > (b.x + b.colw))
    )
