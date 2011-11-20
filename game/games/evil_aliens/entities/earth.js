(function() {
  var Earth;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Earth = (function() {

    __extends(Earth, SpriteEntity);

    function Earth(game) {
      Earth.__super__.constructor.call(this, game, AssetManager.getImage('earth'));
      this.radius = 67;
    }

    Earth.prototype.draw = function(context) {
      context.drawImage(this.sprite, this.x - this.sprite.width / 2, this.y - this.sprite.height / 2);
      return Earth.__super__.draw.call(this, context);
    };

    return Earth;

  })();

  root.Earth = Earth;

}).call(this);
