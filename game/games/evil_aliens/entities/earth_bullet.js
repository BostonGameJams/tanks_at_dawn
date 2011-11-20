(function() {
  var EarthBullet;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EarthBullet = (function() {

    __extends(EarthBullet, Bullet);

    function EarthBullet(game, x, y, angle, explodesAt) {
      this.angle = angle;
      this.explodesAt = explodesAt;
      EarthBullet.__super__.constructor.call(this, game, {
        radial_distance: 95,
        angle: this.angle,
        explodesAt: explodesAt,
        speed: 250
      });
      this.sprite = Sprite.rotateAndCache(AssetManager.getImage('bullet'), this.angle);
    }

    EarthBullet.prototype.draw = function(context) {
      this.drawSpriteCentered(context);
      return EarthBullet.__super__.draw.call(this, context);
    };

    EarthBullet.prototype.explode = function() {
      AssetManager.getSound('bullet-boom').play();
      this.game.screens.game.add(new BulletExplosion(this.game, this.explodesAt.x, this.explodesAt.y));
      return EarthBullet.__super__.explode.call(this);
    };

    EarthBullet.prototype.draw = function(context) {
      this.drawSpriteCentered(context);
      return EarthBullet.__super__.draw.call(this, context);
    };

    return EarthBullet;

  })();

  root.EarthBullet = EarthBullet;

}).call(this);
