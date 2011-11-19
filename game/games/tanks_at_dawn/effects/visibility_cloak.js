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
    VisibilityCloak.__super__.constructor.call(this, game, image);
  }
  VisibilityCloak.prototype.draw = function(context) {
    context.drawImage(this.sprite, this.x, this.y, 512, 512);
    return VisibilityCloak.__super__.draw.call(this, context);
  };
  return VisibilityCloak;
})();
root.VisibilityCloak = VisibilityCloak;