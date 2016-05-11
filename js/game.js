var game = new Phaser.Game(800, 600, Phaser.AUTO, 'minesweeper');


var startState = {
	preload: function() {
		game.load.spritesheet('tiles', parameters.sprites, 36, 36);
		game.load.image('sky', 'assets/sky.png');
		game.load.image('ground', 'assets/platform.png');
		game.load.image('star', 'assets/star.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	},
	create: function() {
		game.add.sprite(0,0,'sky');
		game.add.text(80, 80, 'Hello, welcome to the minesweeper.');
		var startLabel = game.add.text(80, 150, 'Press S to start');

		var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

		sKey.onDown.addOnce(this.start, this);

	},
	start: function() {
		game.state.start('game');
	}
}


var gameState = {
	preload: function() {


	},

	create: function() {

		game.add.sprite(0,0,'sky');
		var board = new Board(10, 10);
		board.group.x = 170;
		board.group.y = 120;
	},

	update: function() {
	}

}



game.state.add("start", startState);
game.state.add("game", gameState);
// game.state.add("end", end);

game.state.start("start");


var parameters = {
	height: 200,
	width: 200,
	tile_height: 36,
	tile_width: 36,
	mines: 10,
	sprites: "assets/tiles_sprites.png"
};

var states = {
	EMPTY: 0,
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4,
	FIVE: 5,
	SIX: 6,
	SEVEN: 7,
	EIGHT: 8,
	FLAG: 9,
	FLAG2: 10,
	HIDDEN: 11,
	FLAG: 12,
	BOMB: 15
}
