var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , util = require('util');

server.listen(8080);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users', user.list);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/broadcast', function (req, res) {
	res.render("broadcast");
});

app.post('/broadcast', function (req, res) {
	io.sockets.emit("news", req.body.message);
	return res.send(JSON.stringify("hola"));
});

io.sockets.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
