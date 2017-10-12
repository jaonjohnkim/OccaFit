var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var db = require('../database/index.js');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

console.log('db server', process.env.DBSERVER);
console.log('db user', process.env.DBUSER);
console.log('db password', process.env.DBPASSWORD);

var options = {
  host: process.env.DBSERVER || 'localhost',
  port: 3306,
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || 'plantlife',
  database: 'fitbud',
  checkExpirationInterval: 60000,
  expiration: 3600000,
}

var sessionStore = new MYSQLStore(options);

var app = express();
app.use(morgan('dev'));

var routeRegister = require('../routes/register');
var routeLogin = require('../routes/login');
var routePostings = require('../routes/postings');
var routeProfile = require('../routes/profile');
var routeWorkout = require('../routes/workout');
var routeDashboard = require('../routes/dashboard');
var routeLogout = require('../routes/logout');
var routeSetup = require('../routes/setup');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('build'));
app.use(session({
    secret: 'secret',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  console.log('body', req.body);
  console.log('session', req.session);
  console.log('isAuth?', req.isAuthenticated());
  console.log('req user:', req.user);
  console.log('cookie', req.cookies);
  next();
})


app.use('/register', routeRegister);
app.use('/setup', routeSetup);
app.use('/login', routeLogin);
app.use('/postings', routePostings);


app.use(checkAuth);

// Below are the protected routes
console.log('about to go to PROFILE')
app.use('/profile', routeProfile);
app.use('/workout', routeWorkout);
app.use('/dashboard', routeDashboard);
app.use('/logout', routeLogout);

// middleware function to check if this is one of the protected routes

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    next();
  }
  else {
    res.status(401).json({});
  }
}



app.listen(process.env.PORT || 3001, function(err){
	if(err) {
		console.log('cannot connect to the server');
	}
	console.log(`listening on ${process.env.PORT || 3001}`);
})


// express session
// express validator
