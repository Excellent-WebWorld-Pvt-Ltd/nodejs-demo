const { validationResult } = require('express-validator');
const passport = require('passport');
require('dotenv').config();

class AuthController {
  static login(req, res) {
    res.render('admin/login', {
      errors: {},
      error: null,
      oldInput: { email: '' },
      t: req.t,
      lng: req.session.lng || 'en',
      appName: process.env.APP_NAME
    });
  }

  static postLogin(req, res, next) {
    const errors = validationResult(req);
    let errorObj = {};

    if (!errors.isEmpty()) {
      errors.array().forEach(err => {
        errorObj[err.path] = err.msg;
      });

      return res.render('admin/login', {
        errors: errorObj,
        error: null,
        oldInput: { email: req.body.email },
        t: req.t,
        lng: req.session.lng || 'en',
        appName: process.env.APP_NAME
      });
    }

    req.body.role = 'admin';
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render('admin/login', {
          errors: {},
          error: info.message,
          oldInput: { email: req.body.email },
          t: req.t,
          lng: req.session.lng || 'en',
          appName: process.env.APP_NAME
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.admin = user; // Optional, for convenience
        if(req.body.lng == 'en-Us')
        {
          req.body.lng = 'en';
        }
        req.session.lng = req.body.lng || 'en'; // Set default language if not specified
        req.flash('success_msg', req.t('Login Successfully!'));
        return res.redirect('/admin/dashboard');
      });
    })(req, res, next);
  }

  static logout(req, res, next) {
    req.logout(err => {
      if (err) return next(err);
      req.session.destroy(() => res.redirect('/admin/login'));
    });
  }
}

module.exports = AuthController;
