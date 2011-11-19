class Tanks extends Mantra.Game
  constructor: (@options = {}) ->
    @player_name = 'Player 1'

    super _.defaults @options,
      assets:
        root_path: '../game/games/tanks_at_dawn/'
        images:
          'a_viz_map'   : 'a_viz_map.png'
        sounds:
          'bullet_shot' : 'simple_shot.mp3'

      screens:
        loading: 'preset'
        pause:   'preset'
        intro:
          preset: 'intro'
          text:   -> "#{@player_name}, find and destroy your opponent!"
        game:
          elements: ->
            @defender = new Tanks.Tank @
            @defender.setCoords x: 332, y: 182

            img = new Image()
            img.src = 'data:image/png;base64,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'
            @visibility_cloak = new VisibilityCloak @, img
            window.vis = @visibility_cloak
            @visibility_cloak.setCoords x: 0, y: 0

            @drawn_map = new DrawnMap @, 'a_viz_map'
            @drawn_map.setCoords x: 0, y: 0

            @map = @loadMap()
            map_enities = []
            map_enities.push new Mantra.MapEntity @, { x: ent.x, y: ent.y, w: 32, h: 32, style: ent.obj.color } for ent in @map.objectMap()

            [@visibility_cloak, @defender, map_enities...]
          on_keys:
            P: -> @game.showScreen 'pause'

  loadMap: -> new Mantra.Map
    map_width:    16
    map_height:   16
    tile_width:   32
    tile_height:  32
    translations:
      'o' : { solid: true,  color: 'orange' }
      'r' : { solid: false, color: 'red'    }
      'x' : { solid: true }
      ' ' : null
    data: ''
      # '''
      # xxxxxxxxxxxxxxxx
      # x    x x       x
      # x      x       x
      # x      xxxx    x
      # x  x   x    r  x
      # x      x       x
      # x  o           x
      # x            xxx
      # x            xxx
      # x      xx      x
      # x      xx      x
      # x      xx o    x
      # x      xx      x
      # x      xx o    x
      # x      xx      x
      # xxxxxxxxxxxxxxxx
      # '''

  configureEngine: ->
    # Levels, in increasing order of verbosity: off, error, warn, info, debug
    $logger.levels
      global: 'debug'
      sound:  'debug'
      assets: 'debug'
      input:  'info'
      game:   'info'

root.Tanks = Tanks