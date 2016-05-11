
var Tile = function(x,y, status, group, board) {

	this.x = x;
	this.y = y;
	this.currentState = states.HIDDEN;
	this.realState = states.EMPTY;
	this.board = board;

	this.click = function() {
		this.board.clickOnTile(this.x, this.y);
		//this.sprite.frame = this.realState;
		if (this.realState == states.BOMB) {
			console.log("Game Over");
		}
	}

	this.reveal = function() {
		this.sprite.frame = this.realState;
		this.currentState = this.realState;
	}


	var sprite = game.add.sprite(x * parameters.tile_width, y * parameters.tile_height, 'tiles', states.HIDDEN, group);
	this.sprite = sprite;

	this.sprite.inputEnabled = true;
	this.sprite.input.useHandCursor = true;
	this.sprite.events.onInputDown.add(this.click, this);
}



var Board = function(width, height) {


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
			tile[0].realState = states.BOMB;
		}
	}


	this.calculateNumbers = function() {
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				// If there is a bomb, we increase every numbers around (except for the bombs)
				if (this.board[i][j].realState == states.BOMB) {
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
				console.log("you lost");
			}
		}
	};


	// *** Creation of the board ***

  this.width = width;
  this.height = height;

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
	this.setRandomBombs(10);

	// TODO : Calculate numbers behind each tile
	this.calculateNumbers();


	this.group = group;


}
