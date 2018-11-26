'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const config = require('./config');
const process = require('process');
var request = require('sync-request');
var helmet = require('helmet');
const scope = 'email.read';

// Express configuration
const app = express();
//Helmet xcustom settings
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
app.use(errorHandler());
app.use(session({ secret: '55ddf721ff53788190b89c', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.
//   Typically, this will be as simple as storing the user ID when serializing,
//   and finding the user by ID when deserializing.
//   However, since this example does not have a database of user records,
//   the complete user profile is serialized and deserialized.
passport.serializeUser((user, done) =>  done(null, user));
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res, next) => res.render('index'));
app.get('/login', (req, res, next) => res.render('login'));

passport.use(new OAuth2Strategy({
  authorizationURL: config.oauth2ServerBaseUrl + config.authorizationUrl,
  tokenURL: config.oauth2ServerBaseUrl + config.tokenUrl,
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackUrl
},
function(token, refreshToken, profile, cb) {
  console.log('accessToken='+token);
  return cb(null, token);
}
));
//Test scope matching
app.get('/auth', passport.authenticate('oauth2',{scope: scope}));

//Test scope mismatch
app.get('/auth2', passport.authenticate('oauth2',{scope: 'non-exist'}));

app.get('/auth-callback',
  passport.authenticate('oauth2', { failureRedirect: '/'}),
  function(req, res) {
    var response = request('GET', config.oauth2ServerBaseUrl + config.userInfoUrl+'?scope='+scope, {
      headers: {'Authorization': 'Bearer '+req.user},
    });
    res.set('Content-Type','text/html; charset=utf-8');
    res.send(response.getBody());
  });

//SSL setup
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('/root/exercise/provider/server.key'),
    cert: fs.readFileSync('/root/exercise/provider/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var port = 3002;
var server = https.createServer(options, app).listen(port, function(){
  console.log("Consumer is listening on port " + port);
});