var Tanks;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __slice = Array.prototype.slice;
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
          text: function() {
            return "" + this.player_name + ", find and destroy your opponent!";
          }
        },
        game: {
          elements: function() {
            var ent, map_enities, _i, _len, _ref;
            this.p1_tank = new Tanks.Tank(this, {
              color: 'red'
            });
            this.p1_tank.setCoords({
              x: 332,
              y: 182
            });
            this.p2_tank = new Tanks.Tank(this, {
              color: 'blue'
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
            }
          }
        }
      }
    }));
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
      input: 'info',
      game: 'info'
    });
  };
  return Tanks;
})();
root.Tanks = Tanks;