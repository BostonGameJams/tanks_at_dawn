(function() {
  var Tanks;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tanks = (function() {

    __extends(Tanks, Mantra.Game);

    function Tanks(options) {
      var _this = this;
      this.options = options != null ? options : {};
      Tanks.__super__.constructor.call(this, _.defaults(this.options, this.first_init = true, {
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
        process_game_over: function(data) {
          _this.winner = data.winner;
          return _this.showScreen('gameover');
        },
        sunZ: 0,
        sunX: -0.3,
        sunY: -0.3,
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
              if (this.click) return this.state.send_event('start_p1_turn');
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
              if (this.click) return this.state.send_event('start_p2_turn');
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
                x: 416,
                y: 192
              });
              this.p2_tank = new Tanks.Tank(this, {
                color: 'blue',
                name: 'p2'
              });
              this.p2_tank.setCoords({
                x: 128,
                y: 128
              });
              this.visibility_cloak = new VisibilityCloak(this, $('#resized-canvas')[0]);
              return [this.p1_tank, this.p2_tank, this.visibility_cloak];
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
              if (this.first_init) {
                this.first_init = false;
                return $em.listen('tanks::tile_selected', this, function(data) {
                  var other_name, other_tank, other_tank_tile;
                  if (this.state.current_state.match(/_turn/)) {
                    if (this.moveEm(data)) {
                      this.state.send_event("start_" + this.current_tank.name + "_shoot_round");
                      return game.redrawMap();
                    }
                  } else if (this.state.current_state.match(/after_move/)) {
                    if (this.moveEm(data)) {
                      other_name = _.without(['p1', 'p2'], this.current_tank.name)[0];
                      this.state.send_event("ready_" + other_name);
                      return game.redrawMap();
                    }
                  } else if (this.state.current_state.match(/shoot/)) {
                    console.log('pew pew');
                    other_tank = _.without([this.p1_tank, this.p2_tank], this.current_tank)[0];
                    other_tank_tile = other_tank.currentTile();
                    other_name = _.without(['p1', 'p2'], this.current_tank.name)[0];
                    if (data.tile_selected_x === other_tank_tile.x && data.tile_selected_y === other_tank_tile.y) {
                      return this.state.send_event("" + this.current_tank.name + "_wins");
                    } else {
                      return this.state.send_event("start_" + this.current_tank.name + "_after_move");
                    }
                  }
                });
              }
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
              if (this.click) return this.state.send_event('ready_p1');
            },
            on_keys: {
              ' ': function() {
                return this.game.state.send_event('ready_p1');
              }
            }
          }
        }
      }));
      this.state.add_transition('ready_p1', ['started', 'game_lost', 'p2_turn', 'p2_shoot_round', 'p2_after_move', 'p1_won', 'p2_won'], (function() {
        _this.showScreen('p1_ready');
        return _this.gridder.hide();
      }), 'p1_get_ready');
      this.state.add_transition('start_p1_turn', ['p1_get_ready'], (function() {
        _this.current_tank = _this.p1_tank;
        _this.showScreen('game');
        _this.gridder.show();
        return game.redrawMap();
      }), 'p1_turn');
      this.state.add_transition('start_p1_shoot_round', ['p1_turn'], (function() {
        return console.log('Starting P1 shoot round');
      }), 'p1_shoot_round');
      this.state.add_transition('start_p1_after_move', ['p1_shoot_round'], (function() {
        return console.log('Starting P1 after-move round');
      }), 'p1_after_move');
      this.state.add_transition('ready_p2', ['p1_turn', 'p1_shoot_round', 'p1_after_move'], (function() {
        _this.showScreen('p2_ready');
        return _this.gridder.hide();
      }), 'p2_get_ready');
      this.state.add_transition('start_p2_turn', ['p2_get_ready'], (function() {
        _this.current_tank = _this.p2_tank;
        _this.showScreen('game');
        _this.gridder.show();
        return game.redrawMap();
      }), 'p2_turn');
      this.state.add_transition('start_p2_shoot_round', ['p2_turn'], (function() {
        return console.log('Starting P2 shoot round');
      }), 'p2_shoot_round');
      this.state.add_transition('start_p2_after_move', ['p2_shoot_round'], (function() {
        return console.log('Starting P2 after-move round');
      }), 'p2_after_move');
      this.state.add_transition('p1_wins', ['p1_turn', 'p1_shoot_round'], (function() {
        _this.options.process_game_over.call(_this, {
          winner: 'p1'
        });
        return _this.gridder.hide();
      }), 'p1_won');
      this.state.add_transition('p2_wins', ['p2_turn', 'p2_shoot_round'], (function() {
        _this.options.process_game_over.call(_this, {
          winner: 'p2'
        });
        return _this.gridder.hide();
      }), 'p2_won');
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

    Tanks.prototype.moveEm = function(data) {
      var current_tile, distance, max_movement_allowed, new_tile;
      max_movement_allowed = 3;
      new_tile = {
        x: data.tile_selected_x,
        y: data.tile_selected_y
      };
      current_tile = this.current_tank.currentTile();
      distance = Math.abs(current_tile.x - new_tile.x) + Math.abs(current_tile.y - new_tile.y);
      if (distance <= max_movement_allowed) {
        this.current_tank.x = new_tile.x * this.tile_width;
        this.current_tank.y = new_tile.y * this.tile_width;
        return true;
      } else {
        return false;
      }
    };

    return Tanks;

  })();

  root.Tanks = Tanks;

}).call(this);
