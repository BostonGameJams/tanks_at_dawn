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
      color: 'rgba(230, 230, 230, .9)',
      name: 'tank'
    });
    Tank.__super__.constructor.call(this, game, null, 0);
    this.name = this.opts.name;
    this.speed = 8;
    _ref = [16, 16], this.colx = _ref[0], this.coly = _ref[1];
    _ref2 = [16, 16], this.colw = _ref2[0], this.colh = _ref2[1];
  }
  Tank.prototype.update = function() {};
  Tank.prototype.draw = function(context) {
    Mantra.Canvas.rectangle(context, {
      x: this.x,
      y: this.y,
      w: this.colw,
      h: this.colh,
      style: this.opts.color
    });
    return Tank.__super__.draw.call(this);
  };
  Tank.prototype.setCoords = function(coords) {
    this.x = coords.x;
    return this.y = coords.y;
  };
  Tank.prototype.isMyTurn = function() {
    return this.game.state.current_state === ("" + this.name + "_turn");
  };
  Tank.prototype.shoot = function() {
    this.game.screens.game.add(new Tanks.DefenderBullet(this.game, {
      x: this.x,
      y: this.y,
      angle: Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x),
      radial_offset: 19,
      fired_by: this
    }));
    return AssetManager.playSound('bullet_shot');
  };
  Tank.prototype.currentTile = function() {
    return {
      x: Math.floor(this.x / this.game.tile_width),
      y: Math.floor(this.y / this.game.tile_width)
    };
  };
  return Tank;
})();