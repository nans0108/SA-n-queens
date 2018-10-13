
var n = 8;					// n by n board
var q;						// array of queen objects
var w;						// width & height of board squares

var showingAll = false;
var showingIndiv;

$(document).ready( function() {
	// find solution
	$('#run').click( function() {
		q = minConflict(n);
	});

	$('#n').change( function() {
		n = parseInt($('#n').val(), 10);
		if (n == 2 || n == 3) {
			n = 4;
		} else if (n > 1000) {
			n = 1000;
		}
		q = minConflict(n);
		$('#currentN').text(n);
	});
});

function setup() {
	var canvas = createCanvas(windowHeight - 10, windowHeight - 10);
	canvas.position(windowWidth / 4, 5);
	q = minConflict(n);
}

function mousePressed() {
	var x = Math.floor(mouseX / w);
	var y = Math.floor(mouseY / w);

	if (board[y][x] == "queen") {
		if (showingIndiv == undefined) {
			visualizualizeBoard(q);
			showingIndiv = {x : x, y : y};
			lines(showingIndiv);
		} else if (showingIndiv.x == x && showingIndiv.y == y) {
			visualizualizeBoard(q);
			showingIndiv = undefined;
		} else {
			visualizualizeBoard(q);
			showingIndiv = {x : x, y : y};
			lines(showingIndiv);
		}
	}
}

// visualizualizeBoard queen positions
function visualizualizeBoard(queens) {
	background(8);
	stroke(100);
	strokeWeight(1);
	fill(1, 4, 244);
	w = height / board.length;
	showingAll = false;

	push();
	translate(0, 0);

	if (queens.length < 700) {
		for (var i = 0; i < queens.length; i++) {
			line(i * w, 0, i * w, height);
			line(0, i * w, w * queens.length, i * w);
		}
	}

	for (var i = 0; i < queens.length; i++) {
		rect(queens[i].x * w, queens[i].y * w, w, w);
	}
	pop();
}
