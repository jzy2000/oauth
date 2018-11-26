'use strict';
const crypto = require('crypto');

module.exports.getUid = function(length) {
  return crypto.randomBytes(length).toString('hex');
};

module.exports.getHash = function(pass, salt) {
  //var hash=crypto.pbkdf2Sync(pass, salt, 100000, 512, 'sha512').toString('hex');
  return crypto.pbkdf2Sync(pass, salt, 100000, 512, 'sha512').toString('hex');
}

