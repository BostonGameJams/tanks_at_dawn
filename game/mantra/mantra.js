
  define(['jquery/jquery-1.6.2', 'jquery/jquery.hotkeys', 'underscore', 'base', 'machine', 'shims', 'js-finite-state-machine', 'helpers', 'cs!../mantra/util/util', 'cs!../games/tanks_at_dawn/tanks_at_dawn'], function(jquery, jquery_hotkeys) {
    var launchGame;
    console.log('Mantra is loaded!');
    launchGame = function(game_name) {
      var game, game_launcher;
      game_launcher = GameLauncher.launchInto(game_name, Mantra.Canvas.j_createCanvas().appendTo('#game_holder').get(0));
      return game = game_launcher.game;
    };
    return launchGame(eval(geturlparameter('game') || 'EightByFive'));
  });
