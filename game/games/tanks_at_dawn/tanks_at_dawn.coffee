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
          'bullet-boom' : 'bullet_boom.mp3'
          # 'tank-music'  : 'TankMusic1_edit_loop.mp3'

        music:
          'tank-music' : 'TankMusic1_edit_loop.mp3'

      process_game_over: (data) =>
        @winner = data.winner
        @showScreen 'gameover'

      screens:
        loading: 'preset'
        pause:   'preset'
        intro:
          preset: 'intro'
          onUpdate: -> @state.send_event 'ready_p1'
          text:   -> "#{@player_name}, find and destroy your opponent!"
        p1_ready:
          elements: (options) ->
            ui_pane = new Mantra.UIPane @
            ui_pane.addTextItem
              color: 'orange'
              x:     'centered'
              y:     'centered'
              text:  -> 'P1, get ready!'
            [ui_pane]
          update: ->
            @state.send_event 'start_p1_turn' if @click
          on_keys:
            ' ': -> @game.state.send_event 'start_p1_turn'
        p2_ready:
          elements: (options) ->
            ui_pane = new Mantra.UIPane @
            ui_pane.addTextItem
              color: 'orange'
              x:     'centered'
              y:     'centered'
              text:  -> 'P2, get ready!'
            [ui_pane]
          update: ->
            @state.send_event 'start_p2_turn' if @click
          on_keys:
            ' ': -> @game.state.send_event 'start_p2_turn'
        game:
          elements: ->
            @p1_tank = new Tanks.Tank @, color: 'red', name: 'p1'
            @p1_tank.setCoords x: 332, y: 182

            @p2_tank = new Tanks.Tank @, color: 'blue', name: 'p2'
            @p2_tank.setCoords x: 32, y: 32


            @visibility_cloak = new VisibilityCloak @, 'a_vis_map'

            @map = @loadMap()
            map_enities = []
            map_enities.push new Mantra.MapEntity @, { x: ent.x, y: ent.y, w: 32, h: 32, style: ent.obj.color } for ent in @map.objectMap()

            [@visibility_cloak, @p1_tank, @p2_tank, map_enities...]
          on_keys:
            P: ->
              @game.showScreen 'pause'
              @game.bg_song.pause()
            ' ':   -> @game.state.send_event (if @game.state.current_state == 'p1_turn' then 'ready_p2' else 'ready_p1')
            M: ->
              @game.bg_song.toggleMute()
          on_start: ->
            # @bg_song ||= AssetManager.getBackgroundSong('tank-music')
            # @bg_song.play().mute()
        gameover:
          elements: (options) ->
            ui_pane = new Mantra.UIPane @
            ui_pane.addTextItem
              color: 'orange'
              x:     'centered'
              y:     'centered'
              text:  -> "#{@game.winner} #WINNER"
            [ui_pane]
          update: ->
            @state.send_event 'ready_p1' if @click
          on_keys:
            ' ': -> @game.state.send_event 'ready_p1'            

    @state.add_transition 'ready_p1',      ['started', 'game_lost', 'p2_turn', 'p1_won', 'p2_won'], (=> @showScreen 'p1_ready'), 'p1_get_ready'
    @state.add_transition 'start_p1_turn', ['p1_get_ready'],       (=> @showScreen 'game'),     'p1_turn'
    @state.add_transition 'ready_p2',      ['p1_turn'],            (=> @showScreen 'p2_ready'), 'p2_get_ready'
    @state.add_transition 'start_p2_turn', ['p2_get_ready'],       (=> @showScreen 'game'),     'p2_turn'
    @state.add_transition 'p1_wins', ['p1_turn'],    (=> @options.process_game_over.call @, winner: 'p1'),    'p1_won'
    @state.add_transition 'p2_wins', ['p2_turn'],    (=> @options.process_game_over.call @, winner: 'p2'),    'p2_won'

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
      input:  'debug'
      game:   'info'

root.Tanks = Tanks