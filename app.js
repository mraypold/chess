var express = require('express');
var http = require('http');
var path = require("path");
var hbs = require('express-hbs');
var io = require("socket.io");
var uuid = require('node-uuid');

var app = express();
var server = http.createServer(app)
var socket = io.listen(server);

/***************************************************************************
 * Templating configuration and directory setup.
 **************************************************************************/
app.set('view engine', 'hbs');

app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

/***************************************************************************
 * Routing and controller logic.
 * TODO Move this into seperate files using router()
 **************************************************************************/

app.get('/', function(req, res) {
  res.render('index');
});

/**
 * When user creates a new game, create a game id (socketio room), set the
 * player's color and notify them.
 */
app.get('/game', function(req, res) {
  var gameid = uuid.v4();
  var gameurl = req.headers.host + req.url + '/' + gameid;

  socket.on('connection', function(client) {
    client.join(gameid);
  });

  res.render('game', {
    gamelink: gameurl,
    gameid: gameid
  });
});

/**
 * A user joins an existing game using a URL with an appended uuid. Set the
 * player color and wait for the first chess move.
 */
app.get('/game/:gameid', function(req, res) {
  var gameurl = req.headers.host + req.url;
  var gameid = req.params.gameid

  socket.on('connection', function(client) {
    client.join(gameid);

    // Once two players are connected, assign the colors.
    var clients = socket.nsps['/'].adapter.rooms[gameid];
    var ids = Object.keys(clients);
    if (ids.length === 2) {
      socket.nsps['/'].to(gameid).emit('players', {
        white: ids[0],
        black: ids[1]
      });
    };
  });

  res.render('game', {
    gamelink: gameurl,
    gameid: gameid
  });
});

/***************************************************************************
 * Handle socket events to sync game states between players
 **************************************************************************/

socket.on('connection', function(client) {
  client.on('move', function(arg) {
    var move = JSON.parse(arg);
    client.broadcast.to(move.gameid).emit('move', arg);
  });
});

/***************************************************************************
 * Initialization
 **************************************************************************/

server.listen(3000, function() {
  console.log('Chess app listening on port 3000');
});
