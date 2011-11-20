(function() {
  var root;

  root = typeof global !== "undefined" && global !== null ? global : window;

  root.root = root;

  root.asset_path = '/mantra/';

  root.Mantra = {};

  root.EBF = {};

  root.$em = null;

  root.$logger = null;

  root.$audio_manager = null;

}).call(this);
