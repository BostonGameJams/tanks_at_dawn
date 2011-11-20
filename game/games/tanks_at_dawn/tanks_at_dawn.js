var Tanks;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Tanks = (function() {
  __extends(Tanks, Mantra.Game);
  function Tanks(options) {
    this.options = options != null ? options : {};
    this.player_name = 'Player 1';
    Tanks.__super__.constructor.call(this, _.defaults(this.options, {
      assets: {
        root_path: '../game/games/tanks_at_dawn/',
        images: {
          'a_vis_map': 'a_vis_map.png'
        },
        sounds: {
          'bullet_shot': 'simple_shot.mp3'
        }
      },
      screens: {
        loading: 'preset',
        pause: 'preset',
        intro: {
          preset: 'intro',
          onUpdate: function() {
            return this.state.send_event('ready_p1');
          },
          text: function() {
            return "" + this.player_name + ", find and destroy your opponent!";
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
            var ent, map_enities, _i, _len, _ref;
            this.p1_tank = new Tanks.Tank(this, {
              color: 'red',
              name: 'p1'
            });
            this.p1_tank.setCoords({
              x: 332,
              y: 182
            });
            this.p2_tank = new Tanks.Tank(this, {
              color: 'blue',
              name: 'p2'
            });
            this.p2_tank.setCoords({
              x: 32,
              y: 32
            });
            this.visibility_cloak = new VisibilityCloak(this, 'a_vis_map');
            this.map = this.loadMap();
            map_enities = [];
            _ref = this.map.objectMap();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              ent = _ref[_i];
              map_enities.push(new Mantra.MapEntity(this, {
                x: ent.x,
                y: ent.y,
                w: 32,
                h: 32,
                style: ent.obj.color
              }));
            }
            return [this.visibility_cloak, this.p1_tank, this.p2_tank].concat(__slice.call(map_enities));
          },
          on_keys: {
            P: function() {
              return this.game.showScreen('pause');
            },
            ' ': function() {
              return this.game.state.send_event((this.game.state.current_state === 'p1_turn' ? 'ready_p2' : 'ready_p1'));
            }
          }
        }
      }
    }));
    this.state.add_transition('ready_p1', ['started', 'p2_turn'], (__bind(function() {
      return this.showScreen('p1_ready');
    }, this)), 'p1_get_ready');
    this.state.add_transition('start_p1_turn', ['p1_get_ready'], (__bind(function() {
      return this.showScreen('game');
    }, this)), 'p1_turn');
    this.state.add_transition('ready_p2', ['p1_turn'], (__bind(function() {
      return this.showScreen('p2_ready');
    }, this)), 'p2_get_ready');
    this.state.add_transition('start_p2_turn', ['p2_get_ready'], (__bind(function() {
      return this.showScreen('game');
    }, this)), 'p2_turn');
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
    });
  };
  Tanks.prototype.configureEngine = function() {
    return $logger.levels({
      global: 'debug',
      sound: 'debug',
      assets: 'debug',
      input: 'debug',
      game: 'info'
    });
  };
  return Tanks;
})();
root.Tanks = Tanks;