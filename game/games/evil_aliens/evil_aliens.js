var EvilAliens;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
EvilAliens = (function() {
  __extends(EvilAliens, Mantra.Game);
  function EvilAliens(options) {
    this.options = options != null ? options : {};
    this.image_path = "" + root.asset_path + "games/evil_aliens/images/";
    this.audio_path = "" + root.asset_path + "games/evil_aliens/audio/";
    EvilAliens.__super__.constructor.call(this, _.defaults(this.options, {
      center_coordinates: true,
      on_keypress: {
        M: function() {
          return $audio_manager.toggle_mute();
        }
      },
      process_game_over: __bind(function() {
        this.showScreen('game_lost');
        return this.bg_song.stop();
      }, this),
      screens: {
        loading: 'preset',
        pause: 'preset',
        intro: {
          preset: 'intro',
          text: 'Defend Earth from the alien invasion!'
        }
      },
      assets: {
        root_path: 'games/evil_aliens/',
        images: {
          'earth': 'earth.png',
          'alien': 'alien.png',
          'sentry': 'sentry.png',
          'bullet': 'bullet-single.png',
          'explosion': 'explosion.png',
          'alien_explosion': 'alien-explosion.png'
        },
        sounds: {
          'alien-boom': 'alien_boom.mp3',
          'bullet-boom': 'bullet_boom.mp3',
          's_bullet': 'bullet.mp3'
        },
        music: {
          'chaos': 'games/evil_aliens/audio/countdown_to_chaos.mp3'
        }
      }
    }));
    this.resetStats();
  }
  EvilAliens.prototype.guiPane = function() {
    this.ui_pane = new Mantra.UIPane(this);
    this.ui_pane.addTextItem({
      x: this.canvas.width / 2 - 150,
      y: this.canvas.height / 2 - 25,
      text: function() {
        return "Health: " + this.game.lives;
      }
    });
    this.ui_pane.addTextItem({
      color: 'orange',
      x: -this.canvas.width / 2 + 25,
      y: this.canvas.height / 2 - 25,
      text: function() {
        return "Score: " + this.game.score;
      }
    });
    return this.ui_pane;
  };
  EvilAliens.prototype.start = function() {
    this.defineScreen('game', {
      init_on_start: true,
      elements: function() {
        this.background = new Mantra.Background(this, {
          x: -this.canvas.width / 2,
          y: -this.canvas.height / 2
        });
        this.sentry = new Sentry(this);
        this.earth = new Earth(this);
        this.mothership = new Mothership(this);
        this.bg_song = AssetManager.getBackgroundSong('chaos');
        this.game_widget = new GameWidget(this, {
          x: 100,
          y: -100
        });
        return [this.background, this.sentry, this.earth, this.mothership, this.guiPane(), this.game_widget];
      },
      on_keys: {
        P: function() {
          this.showScreen('pause');
          return this.bg_song.pause();
        }
      },
      on_start: function() {
        return this.bg_song.play();
      }
    });
    this.defineScreen('game_lost', {
      elements: function() {
        var intro_ui_pane;
        intro_ui_pane = new Mantra.UIPane(this);
        intro_ui_pane.addTextItem({
          color: 'red',
          x: 'centered',
          y: 0,
          text: __bind(function() {
            return "Game over!\nYour score was " + this.score + ".\nClick to restart.";
          }, this)
        });
        return [intro_ui_pane];
      },
      update: function() {
        if (this.click) {
          this.restart();
          this.bg_song.restart();
          return this.showScreen('game');
        }
      }
    });
    $em.listen('alien::death', this, function(data) {
      $logger.game.info("Alien killed at " + (data.alien.s_coords()));
      return this.score += 10;
    });
    $em.listen('alien::hit_planet', this, function(date) {
      this.lives -= 1;
      if (this.lives === 0) {
        return this.state.send_event('lose');
      }
    });
    return EvilAliens.__super__.start.call(this);
  };
  EvilAliens.prototype.restart = function() {
    var ent, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    this.state.send_event('restart');
    _ref = this.getAliens();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ent = _ref[_i];
      ent.remove_from_world = true;
    }
    _ref2 = this.getBullets();
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      ent = _ref2[_j];
      ent.remove_from_world = true;
    }
    _ref3 = this.getBulletExplosions();
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      ent = _ref3[_k];
      ent.remove_from_world = true;
    }
    return this.resetStats();
  };
  EvilAliens.prototype.resetStats = function() {
    this.lives = 10;
    return this.score = 0;
  };
  EvilAliens.prototype.getAliens = function() {
    var ent, _i, _len, _ref, _results;
    _ref = this.screens.game.entities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ent = _ref[_i];
      if (ent instanceof Alien) {
        _results.push(ent);
      }
    }
    return _results;
  };
  EvilAliens.prototype.getBullets = function() {
    var ent, _i, _len, _ref, _results;
    _ref = this.screens.game.entities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ent = _ref[_i];
      if (ent instanceof EarthBullet) {
        _results.push(ent);
      }
    }
    return _results;
  };
  EvilAliens.prototype.getBulletExplosions = function() {
    var ent, _i, _len, _ref, _results;
    _ref = this.screens.game.entities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ent = _ref[_i];
      if (ent instanceof BulletExplosion) {
        _results.push(ent);
      }
    }
    return _results;
  };
  EvilAliens.prototype.configureEngine = function() {
    return $logger.levels({
      global: 'debug',
      sound: 'warn',
      assets: 'warn',
      input: 'warn',
      game: 'info'
    });
  };
  return EvilAliens;
})();
root.EvilAliens = EvilAliens;