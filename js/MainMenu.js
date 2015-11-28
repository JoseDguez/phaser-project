BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {
	create: function () {
		this.add.sprite(0, 0, 'titlepage');
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
