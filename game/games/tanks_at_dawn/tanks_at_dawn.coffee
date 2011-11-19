class Tanks extends Mantra.Game
  constructor: (@options = {}) ->
    @player_name = 'Player 1'

    super _.defaults @options,
      assets:
        root_path: '../game/games/tanks_at_dawn/'
        images:
          'a_vis_map'   : 'a_vis_map.png'
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
            @p1_tank = new Tanks.Tank @, color: 'red'
            @p1_tank.setCoords x: 332, y: 182

            @p2_tank = new Tanks.Tank @, color: 'blue'
            @p2_tank.setCoords x: 32, y: 32

            @visibility_cloak = new VisibilityCloak @, 'a_vis_map'

            @map = @loadMap()
            map_enities = []
            map_enities.push new Mantra.MapEntity @, { x: ent.x, y: ent.y, w: 32, h: 32, style: ent.obj.color } for ent in @map.objectMap()

            [@visibility_cloak, @p1_tank, @p2_tank, map_enities...]
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