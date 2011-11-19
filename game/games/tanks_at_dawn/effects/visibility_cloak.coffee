class VisibilityCloak extends SpriteEntity
  constructor: (game, @image) ->
    super game, @getSprite()

  draw: (context) ->
    context.drawImage @getSprite(), @x, @y, 512, 512
    super context

  getSprite: ->
    @sprite ||= if typeof @image is 'string' then AssetManager.getImage(@image) else @image

root.VisibilityCloak = VisibilityCloak