BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {
	create: function () {
		this.add.sprite(0, 0, 'titlepage');

		var styleInst = {font: '20px monospace', fill: '#fff'};
		var styleCopy = {font: '15px monospace', fill: '#fff', align: 'center'};

		this.add.text(
			this.game.width / 2, this.game.height / 2 + 80, 'Press SPACE or CLICK the screen to begin.', styleInst
		).anchor.setTo(0.5, 0.5);

		this.add.text(
			this.game.width / 2, this.game.height - 90, 'Images assets Copyright (c) 2002 Ari Feldman', styleCopy
		).anchor.setTo(0.5, 0.5);
		this.add.text(
			this.game.width / 2, this.game.height - 75, 'Sound assets Copyright (c) 2012 - 2015 Devin Watson aka dklon', styleCopy
		).anchor.setTo(0.5, 0.5);
	},

	update: function () {
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.activePointer.isDown) {
    	this.startGame();
    }
	},

	startGame: function (pointer) {
		// Start the game with a 'Fade-Out' touch
		this.game.plugin.fadeAndPlay('rgb(54,69,79)', 0.5, 'Game');
	}
};
