class DrawnMap extends SpriteEntity
  constructor: (game, @image_name) ->
    # console.log 'img', AssetManager.getImage(image_name)
    super game, AssetManager.getImage(@image_name)

  draw: (context) ->
    @sprite ||= AssetManager.getImage @image_name
    context.drawImage @sprite, @x, @y, 512, 512
    super context

root.DrawnMap = DrawnMap