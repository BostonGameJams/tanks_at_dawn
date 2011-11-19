var DrawnMap;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DrawnMap = (function() {
  __extends(DrawnMap, SpriteEntity);
  function DrawnMap(game, image_name) {
    this.image_name = image_name;
    DrawnMap.__super__.constructor.call(this, game, AssetManager.getImage(this.image_name));
  }
  DrawnMap.prototype.draw = function(context) {
    this.sprite || (this.sprite = AssetManager.getImage(this.image_name));
    context.drawImage(this.sprite, this.x, this.y, 512, 512);
    return DrawnMap.__super__.draw.call(this, context);
  };
  return DrawnMap;
})();
root.DrawnMap = DrawnMap;