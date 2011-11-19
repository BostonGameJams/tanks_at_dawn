define [
  'jquery/jquery-1.6.2'
  'jquery/jquery.hotkeys'
  'underscore'
  'base'
  'machine'
  'shims'
  'js-finite-state-machine'
  'helpers'
  'cs!../mantra/util/util'
  'cs!../games/tanks_at_dawn/tanks_at_dawn'
  # 'cs!../mantra/entities/entities'
  # 'cs!../mantra/levels/levels'
  # 'cs!../mantra/events/event_manager'
  # 'cs!../mantra/effects/bullet'
  # 'cs!../mantra/core/game'
  # 'cs!../mantra/controls/keyboard'
  # 'cs!../mantra/config'
  # 'cs!../games/games'
], (jquery, jquery_hotkeys) ->
  # controller.attach view
  # console.log 'regular name is: ' + jquery
  console.log 'Mantra is loaded!'

  launchGame = (game_name) ->
    game_launcher = GameLauncher.launchInto(game_name, Mantra.Canvas.j_createCanvas().appendTo('#game_holder').get(0))
    game = game_launcher.game

  launchGame eval(geturlparameter('game') ||'EightByFive')
