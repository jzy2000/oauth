'use strict';

const passport = require('passport');

module.exports.info = [
  passport.authenticate('bearer', { session: false }),
  (request, response) => {
    var found=false;
    for (var i in request.authInfo.scope)
      if (request.authInfo.scope[i]=='*' || request.authInfo.scope[i]== request.query.scope) {
        found=true;
        response.json({ name: request.user.name, email: request.user.email});
        break;
      }
    if (!found) {
      console.log('Mismatch token scope:'+request.authInfo.scope+' requested scope:'+request.query.scope);
      response.send("Unauthorized Scope: "+request.query.scope);
    }
  }
];
