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
    this.setupBackground();
    this.setupPlayer();
    this.setupBullets();

    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
    this.processPlayerInput();
  },

  setupBackground: function() {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
    this.background.autoScroll(0, 12);
  },

  setupPlayer: function() {
    this.player = this.add.sprite(this.game.width / 2, this.game.height - 75, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [0, 1, 2], 10, true);
    this.player.animations.add('ghost', [3, 0, 3, 1], 20, true);
    this.player.play('fly');
    this.physics.arcade.enable(this.player);
    this.player.speed = 300;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(60, 50, 0, 5);
  },

  setupBullets: function() {
    this.playerBullet = this.add.group();
    this.playerBullet.enableBody = true;
    this.playerBullet.physicsBodyType = Phaser.Physics.ARCADE;
    this.playerBullet.createMultiple(500, 'bullet');
    this.playerBullet.setAll('anchor.x', 0.5);
    this.playerBullet.setAll('anchor.y', 0.5);
    this.playerBullet.setAll('outOfBoundsKill', true);
    this.playerBullet.setAll('checkWorldBounds', true);

    this.nextShotAt = 0;
    this.shotDelay = Phaser.Timer.SECOND * 0.1;
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

    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown) {
      this.fire();
    }
  },

  fire: function() {
    if(this.nextShotAt > this.time.now) return;

    this.nextShotAt = this.time.now + this.shotDelay;

    var bullet;
    if(this.playerBullet.countDead() === 0) return;

    bullet = this.playerBullet.getFirstExists(false);
    bullet.reset(this.player.x, this.player.y - 10);
    bullet.body.velocity.y = -250;
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
    this.background.destroy();
    this.player.destroy();
    this.playerBullet.destroy();

    this.state.start('MainMenu');
  }
};
