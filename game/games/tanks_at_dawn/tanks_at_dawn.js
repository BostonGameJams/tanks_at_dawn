var Tanks;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Tanks = (function() {
  __extends(Tanks, Mantra.Game);
  function Tanks(options) {
    this.options = options != null ? options : {};
    Tanks.__super__.constructor.call(this, _.defaults(this.options, {
      assets: {
        root_path: '../game/games/tanks_at_dawn/',
        images: {
          'a_vis_map': 'a_vis_map.png'
        },
        sounds: {
          'bullet_shot': 'simple_shot.mp3',
          'bullet-boom': 'bullet_boom.mp3'
        },
        music: {
          'tank-music': 'TankMusic1_edit_loop.mp3'
        }
      },
      process_game_over: __bind(function(data) {
        this.winner = data.winner;
        return this.showScreen('gameover');
      }, this),
      screens: {
        loading: 'preset',
        pause: 'preset',
        intro: {
          preset: 'intro',
          onUpdate: function() {
            return this.state.send_event('ready_p1');
          }
        },
        p1_ready: {
          elements: function(options) {
            var ui_pane;
            ui_pane = new Mantra.UIPane(this);
            ui_pane.addTextItem({
              color: 'orange',
              x: 'centered',
              y: 'centered',
              text: function() {
                return 'P1, get ready!';
              }
            });
            return [ui_pane];
          },
          update: function() {
            if (this.click) {
              return this.state.send_event('start_p1_turn');
            }
          },
          on_keys: {
            ' ': function() {
              return this.game.state.send_event('start_p1_turn');
            }
          }
        },
        p2_ready: {
          elements: function(options) {
            var ui_pane;
            ui_pane = new Mantra.UIPane(this);
            ui_pane.addTextItem({
              color: 'orange',
              x: 'centered',
              y: 'centered',
              text: function() {
                return 'P2, get ready!';
              }
            });
            return [ui_pane];
          },
          update: function() {
            if (this.click) {
              return this.state.send_event('start_p2_turn');
            }
          },
          on_keys: {
            ' ': function() {
              return this.game.state.send_event('start_p2_turn');
            }
          }
        },
        game: {
          elements: function() {
            this.p1_tank = new Tanks.Tank(this, {
              color: 'red',
              name: 'p1'
            });
            this.p1_tank.setCoords({
              x: 16,
              y: 16
            });
            this.p2_tank = new Tanks.Tank(this, {
              color: 'blue',
              name: 'p2'
            });
            this.p2_tank.setCoords({
              x: 128,
              y: 128
            });
            this.visibility_cloak = new VisibilityCloak(this, 'a_vis_map');
            return [this.visibility_cloak, this.p1_tank, this.p2_tank];
          },
          on_keys: {
            P: function() {
              this.game.showScreen('pause');
              return this.game.bg_song.pause();
            },
            ' ': function() {
              return this.game.state.send_event((this.game.state.current_state === 'p1_turn' ? 'ready_p2' : 'ready_p1'));
            },
            M: function() {
              return this.game.bg_song.toggleMute();
            }
          },
          on_start: function() {
            this.bg_song || (this.bg_song = AssetManager.getBackgroundSong('tank-music'));
            this.bg_song.play().mute();
            this.tile_width = 16;
            return $em.listen('tanks::tile_selected', this, function(data) {
              var current_tile, distance, max_movement_allowed, new_tile;
              max_movement_allowed = 2;
              console.log('data', data);
              new_tile = {
                x: data.tile_selected_x,
                y: data.tile_selected_y
              };
              current_tile = {
                x: Math.floor(this.current_tank.x / this.tile_width),
                y: Math.floor(this.current_tank.y / this.tile_width)
              };
              console.log('current_tile, new_tile', current_tile, new_tile);
              distance = Math.abs(current_tile.x - new_tile.x) + Math.abs(current_tile.y - new_tile.y);
              console.log('distance', distance);
              if (distance <= max_movement_allowed) {
                this.current_tank.x = new_tile.x * this.tile_width;
                return this.current_tank.y = new_tile.y * this.tile_width;
              }
            });
          }
        },
        gameover: {
          elements: function(options) {
            var ui_pane;
            ui_pane = new Mantra.UIPane(this);
            ui_pane.addTextItem({
              color: 'orange',
              x: 'centered',
              y: 'centered',
              text: function() {
                return "" + this.game.winner + " #WINNER";
              }
            });
            return [ui_pane];
          },
          update: function() {
            if (this.click) {
              return this.state.send_event('ready_p1');
            }
          },
          on_keys: {
            ' ': function() {
              return this.game.state.send_event('ready_p1');
            }
          }
        }
      }
    }));
    this.state.add_transition('ready_p1', ['started', 'game_lost', 'p2_turn', 'p1_won', 'p2_won'], (__bind(function() {
      this.showScreen('p1_ready');
      return this.gridder.hide();
    }, this)), 'p1_get_ready');
    this.state.add_transition('start_p1_turn', ['p1_get_ready'], (__bind(function() {
      this.current_tank = this.p1_tank;
      this.showScreen('game');
      return this.gridder.show();
    }, this)), 'p1_turn');
    this.state.add_transition('ready_p2', ['p1_turn'], (__bind(function() {
      this.showScreen('p2_ready');
      return this.gridder.hide();
    }, this)), 'p2_get_ready');
    this.state.add_transition('start_p2_turn', ['p2_get_ready'], (__bind(function() {
      this.current_tank = this.p2_tank;
      this.showScreen('game');
      return this.gridder.show();
    }, this)), 'p2_turn');
    this.state.add_transition('p1_wins', ['p1_turn'], (__bind(function() {
      this.options.process_game_over.call(this, {
        winner: 'p1'
      });
      return this.gridder.hide();
    }, this)), 'p1_won');
    this.state.add_transition('p2_wins', ['p2_turn'], (__bind(function() {
      this.options.process_game_over.call(this, {
        winner: 'p2'
      });
      return this.gridder.hide();
    }, this)), 'p2_won');
    this.setupDOM();
  }
  Tanks.prototype.loadMap = function() {
    return new Mantra.Map({
      map_width: 16,
      map_height: 16,
      tile_width: 32,
      tile_height: 32,
      translations: {
        'o': {
          solid: true,
          color: 'orange'
        },
        'r': {
          solid: false,
          color: 'red'
        },
        'x': {
          solid: true
        },
        ' ': null
      },
      data: ''
    }, 'xxxxxxxxxxxxxxxx\nx    x x       x\nx      x       x\nx      xxxx    x\nx  x   x    r  x\nx      x       x\nx  o           x\nx            xxx\nx            xxx\nx      xx      x\nx      xx      x\nx      xx o    x\nx      xx      x\nx      xx o    x\nx      xx      x\nxxxxxxxxxxxxxxxx');
  };
  Tanks.prototype.setupDOM = function() {
    var game, grid_height, grid_width, i, j, pixel_height, pixel_width;
    pixel_width = 512;
    pixel_height = 512;
    grid_width = 32;
    grid_height = 32;
    this.gridder = $('<div class="gridder">').appendTo('#game_holder').hide();
    for (i = 0; 0 <= grid_width ? i < grid_width : i > grid_width; 0 <= grid_width ? i++ : i--) {
      for (j = 0; 0 <= grid_height ? j < grid_height : j > grid_height; 0 <= grid_height ? j++ : j--) {
        $('<div class="grid_square">').appendTo(this.gridder);
      }
    }
    $('<label class="selected"></label>').css({
      position: 'fixed',
      right: '20px',
      bottom: '20px'
    }).appendTo('body');
    game = this;
    return this.gridder.click(function(e) {
      var tile_selected_x, tile_selected_y, x, y;
      x = e.pageX - this.offsetLeft - $('#game_holder').position().left;
      y = e.pageY - this.offsetTop - $('#game_holder').position().top;
      $('.gridder .grid_square').removeClass('selected');
      $(e.target).addClass('selected');
      tile_selected_x = Math.floor(x / game.tile_width);
      tile_selected_y = Math.floor(y / game.tile_width);
      $('label.selected').text("Tile selected: " + tile_selected_x + ", " + tile_selected_y);
      return $em.trigger('tanks::tile_selected', {
        tile_selected_x: tile_selected_x,
        tile_selected_y: tile_selected_y
      });
    });
  };
  Tanks.prototype.configureEngine = function() {
    return $logger.levels({
      global: 'warn',
      sound: 'warn',
      assets: 'warn',
      input: 'warn',
      game: 'warn'
    });
  };
  return Tanks;
})();
root.Tanks = Tanks;