'use strict';

const passport = require('passport');
const login = require('connect-ensure-login');
const db = require('../db');
const utils = require('../utils');

module.exports.index = (request, response) => response.render('index');

module.exports.loginForm = (request, response) => response.render('login');

module.exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.account = [
  login.ensureLoggedIn(),
  (request, response) => response.render('account', { user: request.user }),
];

module.exports.newuserForm = (req, res) => 
{
  var errors = '';
  if (req.session.errors && req.session.errors.length>0) {
    errors = req.session.errors[0].msg;
    for (var i=1; i<req.session.errors.length; i++)
      errors += ","+req.session.errors[i].msg;
  }
  req.session.errors = null;
  res.render('newuser', { errors: errors });
}

module.exports.newuser = (req, res) => { 
  req.check('email', 'Invalid email address').isEmail();
  req.check('password', 'Password either mismatch or fails to meet length requirement 8-20' ).isLength({min: 8, max: 20}).equals(req.body.confirmPassword);
  req.check('name', 'Name is required, max length 20').isLength({min: 1, max: 20});
  req.check('username', 'Username already exists, or not meet length requirement 4-20').isLength({min: 4, max:20}).custom((value ) => {
    return db.users.findByUsername(value, (error, user) => {
      return !user;
    });
  });

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/newuser');
  } else {
    var salt = utils.getUid(16);
    var password = utils.getHash(req.body.password, salt);
    db.users.addUser(
      req.sanitize(req.body.username), 
      req.sanitize(req.body.name), 
      req.sanitize(req.body.email), 
      salt, password, (error, user) => {
      if (error) throw new Error('Failed to Add New User.');
    });
    req.session.success = true;
    res.send('Created successfully, <a href="/login" target="">Login now</a><br>');
  }
}
