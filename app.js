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
 * When user creates a new game, create a game id, socketio room and
 * redirect to a link which both players can join.
 */
app.get('/game', function(req, res) {
  var gameid = uuid.v4();
  var gameurl = req.headers.host + req.url + '/' + gameid;

  // Socketio room will be the gameid
  socket.on('connection', function(client) {
    client.join(gameid);
    console.log('player joined ' + gameid);
  });

  res.render('game', {gamelink: gameurl});
});

/**
 * A user joins an existing game using a URL with an appended uuid
 */
app.get('/game/:gameid', function(req, res) {
  // TODO game does not exist, create a new one
  // TODO game does exist.
  var gameurl = req.headers.host + req.url;

  socket.on('connection', function(client) {
    client.join(req.params.gameid);
    console.log('player joined ' + req.params.gameid);
  });

  res.render('game', {gamelink: gameurl});
});

/***************************************************************************
 * Handle socket events to sync game states between players
 **************************************************************************/

// TODO

 socket.on('connection', function(client) {
   console.log('socket connected!');
   client.on('move', function(arg) {
     console.log('move: ' + arg);
   });
 });
 
/***************************************************************************
 * Initialization
 **************************************************************************/

server.listen(3000, function() {
  console.log('Chess app listening on port 3000');
});
