
  Mantra.KeyManager = (function() {

    function KeyManager() {}

    KeyManager.capture_keypresses = function(game, steal) {
      var _this = this;
      this.game = game;
      if (steal == null) steal = 'basic';
      window.keydown = {};
      return $(function() {
        $(document).bind('keydown', function(event) {
          keydown[_this.keyName(event)] = true;
          return _this.hasMod(event) || !steal;
        });
        return $(document).bind('keyup', function(event) {
          var key, key_name;
          key = String.fromCharCode(event.which);
          key_name = _this.keyName(event);
          keydown[key_name] = false;
          $logger.input.debug("Key pressed: '" + key + "' (" + key_name + ")");
          if (_this.game) _this.game.onKey(key);
          return _this.hasMod(event) || !steal;
        });
      });
    };

    KeyManager.keyName = function(event) {
      return $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };

    KeyManager.hasMod = function(event) {
      return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    };

    return KeyManager;

  })();
