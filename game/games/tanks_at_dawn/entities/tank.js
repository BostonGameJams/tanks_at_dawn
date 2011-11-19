var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Tanks.Tank = (function() {
  __extends(Tank, Mantra.Entity);
  function Tank(game, opts) {
    var _ref, _ref2;
    this.opts = opts != null ? opts : {};
    _.defaults(this.opts, {
      color: 'rgba(230, 230, 230, .9)'
    });
    Tank.__super__.constructor.call(this, game, null, 0);
    this.speed = 5;
    _ref = [16, 16], this.colx = _ref[0], this.coly = _ref[1];
    _ref2 = [16, 16], this.colw = _ref2[0], this.colh = _ref2[1];
  }
  Tank.prototype.update = function() {
    Mantra.Controls.moveByKeys.call(this);
    if (this.game.click) {
      this.shoot();
    }
    return this.game.map.tileCollision(this);
  };
  Tank.prototype.draw = function(context) {
    Mantra.Canvas.rectangle(context, {
      x: this.x,
      y: this.y,
      w: 16,
      h: 16,
      style: this.opts.color
    });
    if (this.game.draw_collision_boxes) {
      return Mantra.Canvas.rectangle(context, {
        x: this.x - this.colx,
        y: this.y - this.coly,
        w: 16,
        h: 16,
        hollow: true,
        style: 'white'
      });
    }
  };
  Tank.prototype.setCoords = function(coords) {
    this.x = coords.x;
    return this.y = coords.y;
  };
  Tank.prototype.shoot = function() {
    this.game.screens.game.add(new EBF.DefenderBullet(this.game, {
      x: this.x,
      y: this.y,
      angle: Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x),
      radial_offset: 19
    }));
    return AssetManager.playSound('bullet_shot');
  };
  return Tank;
})();