var express = require('express');
var path = require("path");
var hbs = require('express-hbs');
var uuid = require('node-uuid');

var app = express();

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
app.get('/new', function(req, res) {
  var gameid = uuid.v4();
  res.render('game');
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
