(function() {
  var __slice = Array.prototype.slice;

  Mantra.Logger = (function() {

    Logger.instance = function() {
      var _ref;
      return (_ref = this.singleton) != null ? _ref : this.singleton = new Mantra.Logger;
    };

    Logger.level_map = {
      debug: 4,
      info: 3,
      warn: 2,
      error: 1,
      off: 0
    };

    function Logger(log_levels) {
      this.log_levels = log_levels != null ? log_levels : {};
      null;
    }

    Logger.prototype.subsystems = function() {
      var subsystems, system, _i, _len, _results;
      subsystems = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = subsystems.length; _i < _len; _i++) {
        system = subsystems[_i];
        _results.push(this.registerSubsystem(system));
      }
      return _results;
    };

    Logger.prototype.registerSubsystem = function(name) {
      var _this = this;
      return this[name] = {
        debug: function(message) {
          if (Mantra.Logger.level_map[_this.log_levels[name]] >= Mantra.Logger.level_map['debug']) {
            return _this.log("[" + name + "] " + message);
          }
        },
        info: function(message) {
          if (Mantra.Logger.level_map[_this.log_levels[name]] >= Mantra.Logger.level_map['info']) {
            return _this.log("[" + name + "] " + message);
          }
        },
        warn: function(message) {
          if (Mantra.Logger.level_map[_this.log_levels[name]] >= Mantra.Logger.level_map['warn']) {
            return _this.log("[" + name + "] " + message);
          }
        },
        error: function(message) {
          if (Mantra.Logger.level_map[_this.log_levels[name]] >= Mantra.Logger.level_map['error']) {
            return _this.log("[" + name + "] " + message);
          }
        }
      };
    };

    Logger.prototype.log = function(message) {
      return console.log(message);
    };

    Logger.prototype.levels = function(log_levels) {
      this.log_levels = log_levels;
      return null;
    };

    return Logger;

  })();

}).call(this);
