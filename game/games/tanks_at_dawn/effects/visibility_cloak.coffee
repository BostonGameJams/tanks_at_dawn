class VisibilityCloak extends SpriteEntity
  constructor: (game, image) ->
    super game, image

  draw: (context) ->
    context.drawImage @sprite, @x, @y, 512, 512
    super context

root.VisibilityCloak = VisibilityCloak