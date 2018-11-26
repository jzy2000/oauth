'use strict';

const tokens = {};

module.exports.find = (key, done) => {
  if (tokens[key]) return done(null, tokens[key]);
  return done(new Error('Token Not Found'));
};

module.exports.findByUserIdAndClientId = (userId, clientId, scope, done) => {
  for (var token in tokens) {
    if (tokens[token].userId == userId && tokens[token].clientId == clientId) {
      for (var i in tokens[token].scope)
        if (tokens[token].scope[i] == '*' || tokens[token].scope[i]==scope)
          return done(null, tokens[token]);
    }
  }
  return done(new Error('Token Not Found'));
};

module.exports.save = (token, userId, clientId, authCode, scope, done) => {
  tokens[token] = { userId, clientId, authCode, scope, token };
  done();
};
