class Tanks.Tank extends Mantra.Entity
  constructor: (game, @radius = 16) ->
    super game, null, 0
    @speed = 5
    [@colx, @coly] = [16, 16]
    [@colw, @colh] = [16, 16]

  update: ->
    Mantra.Controls.moveByKeys.call @
    @shoot() if @game.click

    @game.map.tileCollision @

  draw: (context) ->
    Mantra.Canvas.rectangle context,
      x: @x, y: @y
      w: 16, h: 16
      style: 'rgba(230, 230, 230, .9)'

    if @game.draw_collision_boxes
      Mantra.Canvas.rectangle context,
        x: @x - @colx,  y: @y - @coly,
        w: @radius * 2, h: @radius * 2
        hollow: true
        style:  'white'

  setCoords: (coords) ->
    @x = coords.x
    @y = coords.y

  shoot: ->
    @game.screens.game.add new EBF.DefenderBullet @game,
      x:             @x
      y:             @y
      angle:         Math.atan2 @game.mouse.y - @y, @game.mouse.x - @x
      radial_offset: @radius + 3

    AssetManager.playSound 'bullet_shot'
