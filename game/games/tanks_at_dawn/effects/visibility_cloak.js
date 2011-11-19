var VisibilityCloak;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
VisibilityCloak = (function() {
  __extends(VisibilityCloak, SpriteEntity);
  function VisibilityCloak(game, image) {
    this.image = image;
    VisibilityCloak.__super__.constructor.call(this, game, this.getSprite());
  }
  VisibilityCloak.prototype.draw = function(context) {
    context.drawImage(this.getSprite(), this.x, this.y, 512, 512);
    return VisibilityCloak.__super__.draw.call(this, context);
  };
  VisibilityCloak.prototype.getSprite = function() {
    return this.sprite || (this.sprite = typeof this.image === 'string' ? AssetManager.getImage(this.image) : this.image);
  };
  return VisibilityCloak;
})();
root.VisibilityCloak = VisibilityCloak;