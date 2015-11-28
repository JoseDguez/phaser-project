BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
  create: function () {
    this.setupBackground();
    this.setupPlayer();
    this.setupBullets();
    this.setupEnemies();
    this.setupExplosions();
    this.setupText();

    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
    this.processPlayerInput();
    this.spawnEnemies();
    this.checkCollisions();
    this.processDelayedEffects();
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

  setupEnemies: function() {
    this.enemyGroup = this.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyGroup.createMultiple(100, 'greenEnemy');
    this.enemyGroup.setAll('anchor.x', 0.5);
    this.enemyGroup.setAll('anchor.y', 0.5);
    this.enemyGroup.setAll('outOfBoundsKill', true);
    this.enemyGroup.setAll('checkWorldBounds', true);

    this.enemyGroup.forEach(function(enemy) {
      enemy.animations.add('fly', [0,1,2], 20, true);
      enemy.animations.add('hit', [3, 1, 3, 2], 20, false);

      enemy.events.onAnimationComplete.add(function(e) {
        e.play('fly');
      }, this);
    });

    this.nextEnemyAt = 0;
    this.enemyDelay = Phaser.Timer.SECOND * 2;
    this.enemyCount = 0;
  },

  setupExplosions: function() {
    this.explosions = this.add.group();
    this.explosions.enableBody = true;
    this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosions.createMultiple(10, 'explosion');
    this.explosions.setAll('anchor.x', 0.5);
    this.explosions.setAll('anchor.y', 0.5);
    this.explosions.setAll('outOfBoundsKill', true);
    this.explosions.setAll('checkWorldBounds', true);

    this.explosions.forEach(function(explosion) {
      explosion.animations.add('boom');
    });
  },

  setupText: function() {
    this.instructions = this.add.text(
		    this.game.width / 2, this.game.height - 100,
        'Utiliza las flechas para moverte, presiona ESPACIO para disparar\n' +
        'Hacer click con el mouse realiza ambas.',
        {font: '20px monospace', fill: '#fff', align: 'center'}
      );

      this.instructions.anchor.setTo(0.5, 0.5);
      this.instExpire = this.time.now + Phaser.Timer.SECOND * 5;
  },

  processDelayedEffects: function() {
    if(this.instructions.exists && this.time.now > this.instExpire) {
      //this.game.add.tween(this.instructions).to({y: this.instructions.y}, 250, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.instructions).to({alpha: 0}, 250, Phaser.Easing.Linear.None, true);
      //this.instructions.destroy();
    }
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
      this.player.play('fly');
    } else if(this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
      this.player.play('fly');
    }

    if(this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }

    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown) {
      this.fire();
    }
  },

  spawnEnemies: function() {
    if(this.nextEnemyAt < this.time.now && this.enemyGroup.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;

      var enemy = this.enemyGroup.getFirstExists(false);

      enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, 3);

      enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
      enemy.play('fly');
    }
  },

  checkCollisions: function() {
    this.physics.arcade.overlap(this.playerBullet, this.enemyGroup, this.enemyHit, null, this);
  },

  enemyHit: function(bullet, enemy) {
    bullet.kill();
    this.damageEnemy(enemy, 1);
  },

  damageEnemy: function(enemy, damage) {
    enemy.damage(damage);
    if(enemy.alive) {
      enemy.play('hit');
    } else {
      this.explode(enemy);
    }
  },

  explode: function(obj) {
    if(this.explosions.countDead() === 0) return;

    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(obj.x, obj.y);
    explosion.play('boom', 15, false, true);
    explosion.body.velocity.x = obj.body.velocity.x;
    explosion.body.velocity.y = obj.body.velocity.y;
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
    //this.game.debug.body(this.player);
    //this.enemyGroup.forEachAlive(this.renderGroup, this);
  },

  renderGroup: function(obj){
    this.game.debug.body(obj);
  },

  quitGame: function (pointer) {
    this.background.destroy();
    this.player.destroy();
    this.playerBullet.destroy();

    this.state.start('MainMenu');
  }
};
