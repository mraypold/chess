/**
 * Code contained in this file is a mix of http://chessboardjs.com/examples#5003
 * and personal code by Michael Raypold to work with socketio
 */
var board,
  game = new Chess();

var socket = io.connect();

var colors = {
  b: 'black',
  w: 'white'
};

var gameid = $('#gameid').text();
var playercolor = colors.b;

/**
 * Informs the client as to what color they are.
 */
socket.on('color', function(arg) {
  playercolor = arg.color;

  // TODO prevent moves of the opposite color

});

/**
 * Update game state in response to a move from the other socket.
 */
socket.on('move', function(arg) {
  var obj = JSON.parse(arg);

  var movement = {
    from: obj.from,
    to: obj.to,
    promotion: 'q'
  };

  var move = game.move(movement);
  board.position(game.fen());
  updateMoves();
  playerHelper();
});

/**
 * Prints a message at the top of the webpage
 */
var updateBanner = function(msg) {
  var banner = $('#message').text(msg);
};

/**
 * Notifies the player of game ending conditions and move order.
 */
var playerHelper = function() {
  if (game.in_checkmate()) {
    updateBanner(colors[(game.turn())] + ' in checkmate');
  } else if (game.in_check()) {
    updateBanner(colors[(game.turn())] + ' in check');
  } else if (game.in_draw()) {
    updateBanner('Game is a draw!');
  } else if (game.in_stalemate()) {
    updateBanner('Game is a stalemate!');
  } else {
    updateBanner(colors[(game.turn())] + '\'s turn');
  };
};

/**
 * Updates the moves div using algebraic notation
 */
var updateMoves = function() {
  var moves = $('#moves')
  var history = game.history();
  var notation = '';

  // This isn't the most efficient algorithm, but will make it easier
  // when the app is updated to start games with a predfined FEN.
  for(var i = 0; i < history.length; i++){
    if(i % 2 === 0){
      notation += ((i/2) + 1).toString() + '. ';
    }
    notation += history[i] + ' ';
  }
  moves.text(notation);
};

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (game.game_over() === true ||
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  removeGreySquares();

  var movement = {
    from: source,
    to: target,
    promotion: 'q'
  };

  var move = game.move(movement);

  // illegal move
  if (move === null) return 'snapback';

  // Send a message to update the other player's board
  movement['gameid'] = gameid;
  socket.emit('move', JSON.stringify(movement));
  updateMoves();
  playerHelper();
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
