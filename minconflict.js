var board;

function minConflict(n) {
	var possibilites = [];
	for (var i = 0; i < n; i++) {
		possibilites.push(i);
	}

	board = []
	var queens = [];
	for (var row = 0; row < n; row++) {
		board.push(new Array(n));
		for (var col = 0; col < board[row].length; col++) {
			board[row][col] = 0;
		}
		var ind = possibilites[Math.floor(Math.random() * possibilites.length)];
		queens.push({x : ind, y : row});
		possibilites.splice(possibilites.indexOf(ind), 1);
	}

	initializeQueensConflicts(queens);

	var netConflict;  // the sum of all conflicts; when 0, solution is reached
	var lastRow;
	var temp = 100.0
	var rate = 1 - (1 / (n)); 	// rate of change, dependent on n
	var iteration = 0;

	console.log("Rate of change: " + rate + "%");
	console.time("Runtime");
	$('#conflicts').text("");
	$('#descrip').text("");
	$('#descrip').prepend("N: " + n + ", temperature rate of decrease: " + rate.toFixed(4) + "%");

	// until solution found
	while (netConflict != 0) {
		var currentQueen = getMostConflictQueen(queens, lastRow);
		queens.splice(queens.indexOf(currentQueen), 1);

		var nextQueen;
		if (temp != 0 && Math.random() * 100 < temp) {
			var rand = Math.floor(Math.random() * board[currentQueen.y].length);
			board[currentQueen.y][rand] = 0;
			for (var q = 0; q < queens.length; q++) {
				if (checkForConflict(rand, currentQueen.y, queens[q].x, queens[q].y)) {
					board[currentQueen.y][rand]++;
				}
			}
			nextQueen = {x : rand, y : currentQueen.y, conflict: board[currentQueen.y][rand]};
		} else {
			var queenWithlowestConflict = {x : currentQueen.x, y : currentQueen.y, conflict: currentQueen.conflict};
			for (var x = 0; x < board[currentQueen.y].length; x++) {
				board[currentQueen.y][x] = 0;
				for (var q = 0; q < queens.length; q++) {
					if (checkForConflict(x, currentQueen.y, queens[q].x, queens[q].y)) {
						board[currentQueen.y][x]++;
					}
				}

				if (x != currentQueen.x && board[currentQueen.y][x] <= queenWithlowestConflict.conflict) {
					queenWithlowestConflict = {x : x, y : currentQueen.y, conflict: board[currentQueen.y][x]};
				}
			}
			nextQueen = queenWithlowestConflict;
		}

		netConflict = 0;
		for (var q = 0; q < queens.length; q++) {
			if (checkForConflict(currentQueen.x, currentQueen.y, queens[q].x, queens[q].y)) queens[q].conflict--;
			if (checkForConflict(nextQueen.x, nextQueen.y, queens[q].x, queens[q].y)) queens[q].conflict++;
			netConflict += queens[q].conflict;
		}
		netConflict += nextQueen.conflict;

		if (iteration == 0) {
			var initialConflict = netConflict;
		}

		var color = Math.floor(map(netConflict, 0, initialConflict, 255, 0));
		$('#conflicts').append("<span style='color: rgb(" + (color < 0 ? Math.floor(map(color, -255, 0, 255, 0)) : 0) + ", " + color + ", " + 0 + ");'>Iteration " + iteration + " -- Net Conflict: " + netConflict + ", Temp: " + temp.toFixed(3) + "</span><br>");

		queens.push(nextQueen);
		lastRow = currentQueen.y;
		temp *= rate;
		iteration++;

		if (temp < 0.0001) {
			temp = 100.0;
			iteration = 0;
			$('#conflicts').text("");
			$('#descrip').text("");
			$('#descrip').prepend("N: " + n + ", temperature rate of decrease: " + rate.toFixed(4) + "%");
			// console.log("N: " + n + ", temperature rate of decrease: " + rate.toFixed(4) + "%");
			// console.log("Temp reached 0");
		}

		if (iteration > 10000) {
			break;
		}
	}

	console.timeEnd("Runtime");
	for (var i = 0; i < queens.length; i++) {
		board[queens[i].y][queens[i].x] = "queen";
	}

	$('#descrip').append("<br><span>" + iteration + " Iterations.</span>");
	// console.log('iteration: ', iteration);
	visualizualizeBoard(queens);
	return queens;
}

function checkForConflict(x1, y1, x2, y2) {return (isDiagonalConflict(x1, y1, x2, y2) || isAcrossConflict(x1, y1, x2, y2))};

function isDiagonalConflict(x1, y1, x2, y2) {return ((x1 - y1 == x2 - y2) || (x1 + y1 == x2 + y2)) ? true : false};

function isAcrossConflict(x1, y1, x2, y2) {return (x1 == x2 || y1 == y2) ? true : false};

function initializeQueensConflicts(queens) {
	for (var q = 0; q < queens.length; q++) {
		queens[q].conflict = 0;
		for (var i = 0; i < queens.length; i++) {
			if (queens[q] != queens[i] && checkForConflict(queens[q].x, queens[q].y, queens[i].x, queens[i].y)) queens[q].conflict++;
		}
	}
}

function getMostConflictQueen(queens, lastRow) {
	var highest = queens[0];
	for (var i = 0; i < queens.length; i++) {
		if (queens[i].conflict > highest.conflict && queens[i].y != lastRow) highest = queens[i];
	}
	return highest;
}
