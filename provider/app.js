'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
var helmet = require('helmet');
var expressSanitizer = require('express-sanitizer');
var expressValidator = require('express-validator');

// Express configuration
const app = express();

//Helmet custom settings
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(expressSanitizer());
app.use(errorHandler());
app.use(session({ secret: '55ddf721ff53788190b89c', resave: false, saveUninitialized: false, 
  cookie: { secure: true, maxAge: 7200000 } }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

//Site end-points
app.get('/', routes.site.index);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);
app.get('/newuser', routes.site.newuserForm);
app.post('/newuser', routes.site.newuser);

//OAuth end-points
app.get('/authorize', routes.oauth2.authorization);
app.post('/decision', routes.oauth2.decision);
app.post('/token', routes.oauth2.token);

app.get('/userinfo', routes.user.info);

//SSL setup
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/root/exercise/provider/server.key'),
    cert: fs.readFileSync('/root/exercise/provider/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var port = 3000;
var server = https.createServer(options, app).listen(port, function(){
  console.log("Provider is listening on port " + port);
});