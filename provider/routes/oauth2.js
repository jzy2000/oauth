'use strict';

const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');
const db = require('../db');
const utils = require('../utils');

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated. To complete the transaction, the
// user must authenticate and approve the authorization request. Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session. Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient((client, done) => done(null, client.id));

server.deserializeClient((id, done) => {
  db.clients.findByUserId(id, (error, client) => {
    if (error) return done(error);
    return done(null, client);
  });
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources. It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes. The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, req, done) => {
  const code = utils.getUid(16);
  if (typeof req.scope == 'undefined')
    req.scope =['*'];
  /*
  if (typeof ares.token != 'undefined') {
    console.log('found auth code: '+ares.token.authCode);
    return done(null, ares.token.authCode);
  }*/
  console.log('auth code: '+code+' for scope:'+req.scope);
  db.authorizationCodes.save(code, client.clientId, redirectUri, user.username, req.scope, (error) => {
    if (error) return done(error);
    return done(null, code);
  });
}));

// Exchange authorization codes for access tokens. The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, body, authInfo, done) => {
  db.authorizationCodes.find(code, (error, authCode) => {
    if (error) return done(error);
    if (client.clientId !== authCode.clientId) return done(null, false);
    if (redirectUri !== authCode.redirectUri) return done(null, false);

    const token = utils.getUid(256);
    console.log('exchange code->auth token: '+token);
    db.accessTokens.save(token, authCode.userId, authCode.clientId, code, authCode.scope, (error) => {
      if (error) return done(error);
      return done(null, token);
    });
  });
}));

// User authorization endpoint.
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request. In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary accross
// implementations. Once validated, the `done` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction. It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization). We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view.

module.exports.authorization = [
  login.ensureLoggedIn(),
  server.authorization((clientId, redirectUri, done) => {
    db.clients.findByClientId(clientId, (error, client) => {
      if (error) return done(error);
      return done(null, client, redirectUri);
    });
  }, (client, user, scope, done) => {           

    db.accessTokens.findByUserIdAndClientId(user.username, client.clientId, scope, (error, token) => {
      // Pre-approved
      if (token) return done(null, true, {token: token});

      // Otherwise ask user
      return done(null, false);
    });
  }),
  (request, response) => {
    //display scope from passport oauth call
    var scope = '';
    for (var i in request.oauth2.req.scope) {
      request.oauth2.req.scope[i] = request.sanitize(request.oauth2.req.scope[i]);
      scope += request.oauth2.req.scope[i]+',';
    }
    if (scope == '')
      scope = '*';
    scope = '['+scope+']';
    response.render('dialog', {
      transactionId: request.oauth2.transactionID,
      user: request.user,
      client: request.oauth2.client,
      scope: scope
    });
  },
];

// User decision endpoint.
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application. Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  login.ensureLoggedIn(),
  server.decision(),
];


// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['oauth2-client-password']),
  server.token(),
  server.errorHandler(),
];
