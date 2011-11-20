class Tanks extends Mantra.Game
  constructor: (@options = {}) ->
    super _.defaults @options,
      assets:
        root_path: '../game/games/tanks_at_dawn/'
        images:
          'a_vis_map'   : 'a_vis_map.png'
        sounds:
          'bullet_shot' : 'simple_shot.mp3'
          'bullet-boom' : 'bullet_boom.mp3'
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
            @p1_tank.setCoords x: 16, y: 16

            @p2_tank = new Tanks.Tank @, color: 'blue', name: 'p2'
            @p2_tank.setCoords x: 128, y: 128

            @visibility_cloak = new VisibilityCloak @, 'a_vis_map'

            # @map = @loadMap()
            # map_enities = []
            # map_enities.push new Mantra.MapEntity @, { x: ent.x, y: ent.y, w: 32, h: 32, style: ent.obj.color } for ent in @map.objectMap()

            [@visibility_cloak, @p1_tank, @p2_tank] #, map_enities...
          on_keys:
            P: ->
              @game.showScreen 'pause'
              @game.bg_song.pause()
            ' ':   -> @game.state.send_event (if @game.state.current_state == 'p1_turn' then 'ready_p2' else 'ready_p1')
            M: ->
              @game.bg_song.toggleMute()
          on_start: ->
            @bg_song ||= AssetManager.getBackgroundSong('tank-music')
            @bg_song.play().mute()

            @tile_width = 16

            $em.listen 'tanks::tile_selected', this, (data) ->
              max_movement_allowed = 2

              console.log 'data', data
              new_tile =
                x: data.tile_selected_x
                y: data.tile_selected_y

              current_tile =
                x: Math.floor @current_tank.x/@tile_width
                y: Math.floor @current_tank.y/@tile_width

              console.log 'current_tile, new_tile', current_tile, new_tile
              distance = Math.abs(current_tile.x - new_tile.x) + Math.abs(current_tile.y - new_tile.y)
              console.log 'distance', distance
              if distance <= max_movement_allowed
                @current_tank.x = new_tile.x * @tile_width
                @current_tank.y = new_tile.y * @tile_width

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

    @state.add_transition 'ready_p1',      ['started', 'game_lost', 'p2_turn', 'p1_won', 'p2_won'],
      (=>
        @showScreen 'p1_ready'
        @gridder.hide()
      ),
      'p1_get_ready'

    @state.add_transition 'start_p1_turn', ['p1_get_ready'],
      (=>
        @current_tank = @p1_tank
        @showScreen 'game'
        @gridder.show()
      ),
      'p1_turn'

    @state.add_transition 'ready_p2',      ['p1_turn'],
      (=>
        @showScreen 'p2_ready'
        @gridder.hide()
      ),
      'p2_get_ready'

    @state.add_transition 'start_p2_turn', ['p2_get_ready'],
      (=>
        @current_tank = @p2_tank
        @showScreen 'game'
        @gridder.show()
      ),
      'p2_turn'

    @state.add_transition 'p1_wins', ['p1_turn'],
      (=>
        @options.process_game_over.call @, winner: 'p1'
        @gridder.hide()
      ),
      'p1_won'

    @state.add_transition 'p2_wins', ['p2_turn'],
      (=>
        @options.process_game_over.call @, winner: 'p2'
        @gridder.hide()
      ),
      'p2_won'

    @setupDOM()

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
      '''
      xxxxxxxxxxxxxxxx
      x    x x       x
      x      x       x
      x      xxxx    x
      x  x   x    r  x
      x      x       x
      x  o           x
      x            xxx
      x            xxx
      x      xx      x
      x      xx      x
      x      xx o    x
      x      xx      x
      x      xx o    x
      x      xx      x
      xxxxxxxxxxxxxxxx
      '''

  setupDOM: ->
    pixel_width  = 512
    pixel_height = 512
    # grid_width   = 64
    # grid_height  = 64
    grid_width   = 32
    grid_height  = 32
    @gridder =
      $('<div class="gridder">')
        .appendTo('#game_holder')
        .hide()

    for i in [0...grid_width]
      for j in [0...grid_height]
        $('<div class="grid_square">')
          # .css(top: i*pixel_height/grid_height, left: j*pixel_width/grid_width)
          .appendTo(@gridder)

    $('<label class="selected"></label>')
      .css(position: 'fixed', right: '20px', bottom: '20px')
      .appendTo('body')

    game = @

    @gridder.click (e) ->
      x = e.pageX - @offsetLeft - $('#game_holder').position().left
      y = e.pageY - @offsetTop - $('#game_holder').position().top

      # console.log e
      # console.log $(e.target)
      $('.gridder .grid_square').removeClass('selected')
      $(e.target).addClass('selected')
      # css
        # backgroundColor: 'red'

      tile_selected_x = Math.floor x/game.tile_width
      tile_selected_y = Math.floor y/game.tile_width

      $('label.selected').text "Tile selected: #{tile_selected_x}, #{tile_selected_y}"

      $em.trigger 'tanks::tile_selected',
        tile_selected_x: tile_selected_x,
        tile_selected_y: tile_selected_y

  configureEngine: ->
    # Levels, in increasing order of verbosity: off, error, warn, info, debug
    $logger.levels
      global: 'warn'
      sound:  'warn'
      assets: 'warn'
      input:  'warn'
      game:   'warn'

root.Tanks = Tanks