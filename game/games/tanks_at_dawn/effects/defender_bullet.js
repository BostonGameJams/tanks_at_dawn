var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Tanks.DefenderBullet = (function() {
  __extends(DefenderBullet, Bullet);
  function DefenderBullet(game, options) {
    var self;
    this.options = options;
    _.defaults(this.options, {
      size: 4,
      radial_distance: 0,
      speed: 200,
      explodeWhen: function() {
        var targets;
        targets = _.without([game.p1_tank, game.p2_tank], this.fired_by);
        return _.any(targets, function(tank) {
          return tank.collidesWith(self);
        });
      },
      x: 0,
      y: 0
    });
    DefenderBullet.__super__.constructor.call(this, game, this.options);
    self = this;
    this.colh = 4;
    this.colw = 4;
    this.shotFrom = {
      x: this.options.x,
      y: this.options.y
    };
    this.firedAt = Date.now();
    this.radial_offset = this.options.radial_offset;
  }
  DefenderBullet.prototype.draw = function(context) {
    Mantra.Canvas.rectangle(context, {
      x: this.x,
      y: this.y,
      w: this.options.size,
      h: this.options.size,
      style: 'rgba(240, 240, 240, 1)'
    });
    Mantra.Canvas.rectangle(context, {
      x: this.x + 1,
      y: this.y - 1,
      w: 2,
      h: 2,
      style: 'white'
    });
    Mantra.Canvas.rectangle(context, {
      x: this.x + 1,
      y: this.y + this.options.size / 2 + 1,
      w: 2,
      h: 2,
      style: 'white'
    });
    Mantra.Canvas.rectangle(context, {
      x: this.x + this.options.size / 2 + 2,
      y: this.y + 1,
      w: 1,
      h: 2,
      style: 'white'
    });
    return Mantra.Canvas.rectangle(context, {
      x: this.x - 1,
      y: this.y + 1,
      w: 1,
      h: 2,
      style: 'white'
    });
  };
  DefenderBullet.prototype.explode = function() {
    var winner;
    AssetManager.getSound('bullet-boom').play();
    winner = _.without(['p1_tank', 'p2_tank'], 'p1_tank')[0].replace('_tank', '');
    this.game.state.send_event("" + this.fired_by.name + "_wins");
    return DefenderBullet.__super__.explode.call(this);
  };
  DefenderBullet.prototype.move = function() {
    var starting_distance;
    starting_distance = this.radial_offset + this.radial_distance;
    this.x = this.shotFrom.x + (starting_distance * Math.cos(this.angle));
    this.y = this.shotFrom.y + (starting_distance * Math.sin(this.angle));
    return this.radial_distance += this.speed * this.game.clock_tick;
  };
  return DefenderBullet;
})();