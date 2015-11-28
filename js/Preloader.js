BasicGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};

BasicGame.Preloader.prototype = {
	preload: function () {
		this.stage.backgroundColor = '#2d2d2d';
		this.preloadBar = this.add.sprite(300, 400, 'assets/images/preloader-bar.png');
		this.add.text(this.game.width / 2, 350, 'Cargando...', {font: '20px monospace', fill: '#fff'}).anchor.setTo(0.5, 0.5);

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('titlepage', 'assets/images/titlepage.png');
		this.load.image('sea', 'assets/images/bg.png');

		this.load.image('bullet', 'assets/images/bullet.png');

		this.load.spritesheet('player', 'assets/images/player.png', 64, 64);
		this.load.spritesheet('greenEnemy', 'assets/images/green-enemy.png', 32, 32);
		this.load.spritesheet('explosion', 'assets/images/explosion.png', 32, 32);
		//	+ lots of other required assets here
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.

		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.

		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
			this.ready = true;
			this.state.start('MainMenu');
		//}
	}
};
