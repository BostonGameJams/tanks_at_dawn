class Tanks.Tank extends Mantra.Entity
  constructor: (game, @opts = {}) ->
    _.defaults @opts,
      color: 'rgba(230, 230, 230, .9)',
      name:  'tank'

    super game, null, 0
    @name = @opts.name
    @speed = 8
    [@colx, @coly] = [16, 16]
    [@colw, @colh] = [8, 8]

  update: ->
    # Mantra.Controls.moveByKeys.call @ if @isMyTurn()
    @shoot() if @game.click and @isMyTurn()

  draw: (context) ->
    Mantra.Canvas.rectangle context,
      x: @x, y: @y
      w: @colw, h: @colh
      style: @opts.color

    super()

  setCoords: (coords) ->
    @x = coords.x
    @y = coords.y

  isMyTurn: ->
    @game.state.current_state == "#{@name}_turn"

  shoot: ->
    @game.screens.game.add new Tanks.DefenderBullet @game,
      x:             @x
      y:             @y
      angle:         Math.atan2 @game.mouse.y - @y, @game.mouse.x - @x
      radial_offset: 19
      fired_by:      @

    AssetManager.playSound 'bullet_shot'
