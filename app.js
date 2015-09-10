var express = require('express');
var http = require('http');
var path = require("path");
var hbs = require('express-hbs');
var io = require("socket.io");
var uuid = require('node-uuid');

var app = express();
var server = http.createServer(app)
var socket = io.listen(server);

/**
 * Handlebars view engine configuration
 */
app.set('view engine', 'hbs');

app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Return the homepage
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * When user creates a new game, create a game id and redirect for the
 * second player to join.
 */
app.get('/game', function(req, res) {
  var gameid = uuid.v4();
  res.render('game');
});

/**
 * Server listening for incoming requests
 */
server.listen(3000, function() {
  console.log('Chess app listening on port 3000');
});

/**
 * Handle socket connections
 */
socket.on('connection', function(client) {
  console.log('socket connected!');
  client.on('move', function(arg) {
    console.log('move: ' + arg);
  });
});
