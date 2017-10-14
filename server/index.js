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
var socketIo = require('socket.io');
var http = require('http');
var auth = require('./middleware/auth.js');
var passportSocketIo = require('./middleware/passportSocketIo.js');
var sharedSession = require("express-socket.io-session");
var cors = require('cors');

var options = {
  host: process.env.DBSERVER || 'localhost',
  port: 3306,
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || '',
  database: 'fitbud',
  checkExpirationInterval: 60000,
  expiration: 3600000,
}

// This creates a sessions database table automatically
// using the options shown above.
var sessionStore = new MYSQLStore(options);
// console.log('SESSION STORE',sessionStore)
var sessionMiddleware = session({
    key: 'connect.sid',
    secret: 'secret',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 3600000 }
});

var app = express();
app.use(morgan('dev'));
app.use(cors());

// These store the route pathing into variables to be used below
var routeRegister = require('../routes/register');
var routeLogin = require('../routes/login');
var routePostings = require('../routes/postings');
var routeProfile = require('../routes/profile');
var routeWorkout = require('../routes/workout');
var routeDashboard = require('../routes/dashboard');
var routeLogout = require('../routes/logout');
var routeSetup = require('../routes/setup');
var routeSearch = require('../routes/search');
var routeNotifications = require('../routes/notifications');

// These process cookie, session, and authentication
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('build'));
// console.log('Session MIDDLE WARE', sessionMiddleware);
app.use(sessionMiddleware);

// Passport inits
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// app.listen(process.env.PORT || 3001, function(err){
// 	if(err) {
// 		console.log('cannot connect to the server');
// 	}
// 	console.log(`listening on ${process.env.PORT || 3001}`);
// })

// This creates a socketIO listener so that clients and server can connect
var server = http.createServer(app);
var io = socketIo.listen(server);
// var io = socketIo(app);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
})



// Purely development Purposes
// app.use(function (req, res, next) {
//   console.log('body', req.body);
//   console.log('session', req.session);
//   console.log('isAuth?', req.isAuthenticated());
//   console.log('req user:', req.user);
//   console.log('cookie', req.cookies);
//   next();
// })

// These routes do NOT require authentications
app.use('/register', routeRegister);
app.use('/setup', routeSetup);
app.use('/login', routeLogin);
app.use('/search', routeSearch);
app.use('/notification', routeNotifications);
app.use('/postings', routePostings);

// The authentication check happens here, and beyond this point are all the
// routes that require authentication, or else redirects to 401
app.use(auth.checkAuth);

// Below are the protected routes
// console.log('about to go to PROFILE')
app.use('/profile', routeProfile);
app.use('/workout', routeWorkout);
app.use('/dashboard', routeDashboard);
app.use('/logout', routeLogout);


// https://www.codementor.io/tips/0217388244/sharing-passport-js-sessions-with-both-express-and-socket-io
// Socket Connection
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'secret',
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}))

function onAuthorizeSuccess(data, accept) {
  // console.log(accept);
  console.log('successful connection to socket.io', data);
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log('failed to connect to socket.io message', message)
  accept(new Error(message))
  // accept();
}

// io.on('connection', socket => {
//   console.log('WE CONNECTED');
//   var userId = socket.request.session.passport.user;
//   console.log('Your ID is:', userId);
// })

const clients = [];
io.on('connection', socket => {
  //Events to listen for, Change in Event, Change in
  // console.log(arguments);
  // console.log(socket);
  // console.log(socket.request.session.passport.user);
  socket.emit('hello', 'successfully connected, your properties are:', socket.request.session.passport);
  clients.push(socket);
  socket.on('connect', data => {
    socket.emit('hello', 'HI CLIENT~!')
  })
  // socket.on('hello', data => {
  //   clients.forEach(client => {
  //     if (client.id !== socket.id) {
  //       client.emit('hello', 'Hello user:' + client.id + ' from ' + socket.id);
  //     }
  //   })
  //   // socket.emit('hello', 'Hi Client!');
  // })
  socket.on('friendRequestTo', data => {
    console.log('RECEIVED NEW FRIEND REQUEST FROM CLIENT', data);
    console.log('Friend request is from user Id: ' + socket.request.session.passport.user + ' to ' + data);
    clients.forEach(client => {
      if (client.request.session.passport.user === data) {
        console.log('User is online, sending alert')
        client.emit('friendRequestFrom', socket.request.session.passport.user);
      }
    });
  });

  socket.on('friendRequestAccept', data => {
    console.log('RECEIVED ACCEPTED REQUEST FROM CLIENT', data);
    console.log(socket.request.session.passport);
    var userId = data.userOneId || data.userTwoId;
    clients.forEach(client => {
      if (client.request.session.passport.user === userId) {
        console.log('User is online, sending alert')
        client.emit('friendRequestAccept', data.name);
      }
    })
  })
  socket.on('disconnect', () => console.log('Client Disconnected'));
});



server.listen(process.env.PORT || 3001, function(err){
	if(err) {
		console.log('cannot connect to the server');
	}
	console.log(`listening on ${process.env.PORT || 3001}`);
})


// express session
// express validator
