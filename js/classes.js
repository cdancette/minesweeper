

// Tiles states
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
	SELECTED_FLAG: 10,
	HIDDEN: 11,
	SELECTED_HIDDEN: 12,
	MINE: 15
}


// Tile Class
var Tile = function(x,y, status, group, board) {


	//  **** METHODS *****
	this.click = function() {
		this.board.clickOnTile(this.x, this.y);
	}

	this.reveal = function() {
		if (this.currentState == states.HIDDEN){
			this.board.uncovered -=1;
		}
			this.sprite.frame = this.realState;
			this.currentState = this.realState;
	}


	// *** CONSTRUCTOR ***
	this.x = x;
	this.y = y;
	this.currentState = states.HIDDEN;
	this.realState = states.EMPTY;
	this.board = board;


	var sprite = game.add.sprite(x * parameters.tile_width, y * parameters.tile_height, 'tiles', states.HIDDEN, group);
	this.sprite = sprite;

	this.sprite.inputEnabled = true;
	this.sprite.input.useHandCursor = true;
	this.sprite.events.onInputDown.add(this.click, this);

}



var Board = function(width, height, mines) {


	// *** METHODS ***

	// Method to get the tiles that surrounds an other tile

	this.getSurroundings = function(i,j) {
		var list = [[i+1, j], [i-1, j], [i+1, j+1], [i-1,j+1], [i, j+1], [i, j-1], [i+1, j-1], [i-1, j-1]];
		var valid_list = [];
		for ([x,y] of list) {
			if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
				valid_list.push([x,y])
			}
		}

		result = [];

		for ([x,y] of valid_list) {
			result.push(this.board[x][y]);
		}

		return result;
	}


	// Method to set n random bombs in the game
	this.setRandomBombs = function(n) {
		var list_tiles = []
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				list_tiles.push(this.board[i][j]);
			}
		}

		for (var i = 0; i < n; i++) {
			var random = Math.floor((Math.random() * list_tiles.length));
			var tile = list_tiles.splice(random, 1);
			tile[0].realState = states.MINE;
		}
	}


	this.calculateNumbers = function() {
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				// If there is a bomb, we increase every numbers around (except for the bombs)
				if (this.board[i][j].realState == states.MINE) {
					list_surroundings = this.getSurroundings(i, j);
					for (elt of list_surroundings) {
						if (elt.realState < 8) {
							elt.realState += 1;
						}
					}
				}
			}
		}
	}

	// What happens when we click on a tile
	this.clickOnTile = function (i,j) {
		var tiles = [this.board[i][j]];

		if (this.flagging && tiles[0].currentState == states.HIDDEN) {
			this.counter -=1;
			this.textCounter.text = String(this.counter);
			tiles[0].currentState = states.FLAG;
			tiles[0].sprite.frame = states.FLAG;
		}

		else if (this.flagging && tiles[0].currentState == states.FLAG) {
			this.counter +=1;
			this.textCounter.text = String(this.counter);
			tiles[0].currentState = states.HIDDEN;
			tiles[0].sprite.frame = states.HIDDEN;
		}

		else if (this.flagging == false && tiles[0].currentState == states.HIDDEN) {

			while (tiles.length > 0) {
				var tile = tiles.pop();

				if (tile.realState == states.EMPTY){
					tile.reveal();
					var surroundings = this.getSurroundings(tile.x, tile.y);
					var hiddens = []
					// we get surroundings that are hidden
					for (t of surroundings) {
						if (t.currentState == states.HIDDEN) {
							hiddens.push(t);
						}
					}
					for (t of hiddens) {
						t.reveal();
					}
					tiles = tiles.concat(hiddens);
				}

				else if (tile.realState <= states.EIGHT) {
					tile.reveal();
				}

				else {
					if (!this.won) {
						this.loose();
					}
				}
			}
			if (this.uncovered == this.mines) {
				console.log("you win");
				if (!this.lost) {
					this.won = true;
					this.win();
				}
			}
		}
	}


	this.loose = function() {
		this.lost = true;
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				if (this.board[i][j].realState == states.MINE) {
					this.board[i][j].reveal();
					var startLabel = game.add.text(80, 40, 'You looser');
				}
			}
		}
	}


	this.win = function() {
		var startLabel = game.add.text(80, 40, 'You won');
	}


	this.unsetFlagging = function() {
		this.flag.frame = states.FLAG;
		this.hidden.frame = states.SELECTED_HIDDEN;
		this.flagging = false;
	}

	this.setFlagging = function() {
		this.flag.frame = states.SELECTED_FLAG;
		this.hidden.frame = states.HIDDEN;
		this.flagging = true;
	}


	// *** Constructor ***

  this.width = width;
  this.height = height;
	this.mines = mines;
	this.uncovered = width * height; // number of hidden tiles
	this.flagging = false; // to see if we're flagging or not

	// Group to which all tiles belong
	var group = game.add.group();


	// Create the board (tile matrix)
	this.board = [];

	//Fill the board
	for (var i = 0; i < width; i++) {
		var row = []
		for (var j = 0; j < height; j++) {
			var tile = new Tile(i,j, true, group, this);
			row.push(tile);
		}
		this.board.push(row);
	}


	// Set the bombs
	this.setRandomBombs(mines);

	// TODO : Calculate numbers behind each tile
	this.calculateNumbers();

	this.hidden = game.add.sprite(group.x + 4 * parameters.tile_width, group.y + 10 * parameters.tile_height + 30, 'tiles', states.SELECTED_HIDDEN, group);
	this.flag = game.add.sprite(group.x + 5 * parameters.tile_width , group.y + 10 * parameters.tile_height + 30, 'tiles', states.FLAG, group);

	this.hidden.inputEnabled = true;
	this.hidden.input.useHandCursor = true;
	this.hidden.events.onInputDown.add(this.unsetFlagging, this);

	this.flag.inputEnabled = true;
	this.flag.input.useHandCursor = true;
	this.flag.events.onInputDown.add(this.setFlagging, this);



	this.counter = parameters.mines;
	this.textCounter = game.add.text(80, 300, String(this.counter));



	this.group = group;
}
