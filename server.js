const express = require('express');
const session  = require('express-session');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./config/socketio')(io);

const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const passport = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'app/view'));
app.set('view engine', 'ejs');

app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const routes = require('./routes/index');

app.use('/', routes);

app.use(function(req, res, next) {
  res.render('error');
});

server.listen(3000, () => {
	console.log('server listening on port 3000');
});