class Tanks.DefenderBullet extends Bullet
  constructor: (game, @options) ->
    _.defaults @options,
      size: 4
      radial_distance: 0
      speed:           200
      explodeWhen:     ->
                        targets = _.without([game.p1_tank, game.p2_tank], @fired_by)
                        _.any(targets, (tank) ->
                          tank.collidesWith self
                        )
      x: 0
      y: 0

    super game, @options

    self = @

    # @setOptions
    #   radial_distance: 0
    #   angle:           @options.angle
    #   speed:           200
    #   explodeWhen:     ->
    #                     _.any([game.p1_tank, game.p2_tank], (tank) ->
    #                       tank.collidesWith self
    #                     )
    #   x: 0
    #   y: 0

    @colh = 4
    @colw = 4

    @shotFrom      = { x: @options.x, y: @options.y }
    @firedAt       = Date.now()
    @radial_offset = @options.radial_offset

  draw: (context) ->
    Mantra.Canvas.rectangle context,
      x: @x, y: @y, w: @options.size, h: @options.size
      style:  'rgba(240, 240, 240, 1)'

    Mantra.Canvas.rectangle context, x: @x + 1, y: @y - 1, w: 2, h: 2, style:  'white'
    Mantra.Canvas.rectangle context, x: @x + 1, y: @y + @options.size/2 + 1, w: 2, h: 2, style:  'white'
    Mantra.Canvas.rectangle context, x: @x + @options.size/2 + 2, y: @y + 1, w: 1, h: 2, style:  'white'
    Mantra.Canvas.rectangle context, x: @x - 1, y: @y + 1, w: 1, h: 2, style:  'white'

  explode: ->
    AssetManager.getSound('bullet-boom').play()
    winner = _.without(['p1_tank', 'p2_tank'], 'p1_tank')[0].replace('_tank', '')
    @game.state.send_event "#{@fired_by.name}_wins"
    super()

  move: ->
    starting_distance = @radial_offset + @radial_distance
    @x = @shotFrom.x + (starting_distance * Math.cos(@angle))
    @y = @shotFrom.y + (starting_distance * Math.sin(@angle))
    @radial_distance += @speed * @game.clock_tick;
