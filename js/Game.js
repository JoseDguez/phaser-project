BasicGame.Game = function (game) {
  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

  //  You can use any of these from any function within this State.
  //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

BasicGame.Game.prototype = {
  create: function () {
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.setupBackground();
    this.setupPlayer();

    // Movement
    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.processPlayerInput();
  },

  setupBackground: function() {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
    this.background.autoScroll(0, 12);
  },

  setupPlayer: function() {
    this.player = this.add.sprite(this.game.width / 2, this.game.height - 75, 'player');
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.speed = 300;
    this.player.animations.add('fly', [0, 1, 2], 10, true);
    this.player.animations.add('ghost', [3, 0, 3, 1], 20, true);
    this.player.play('fly');
  },

  processPlayerInput: function() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }

    if(this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if(this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }

    if(this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }
  },

  render: function() {
    // Debug
    this.game.debug.body(this.player);
    //this.group.forEachAlive(this.renderGroup, this);
  },

  renderGroup: function(member){
    this.game.debug.body(member);
  },

  quitGame: function (pointer) {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');
  }
};
