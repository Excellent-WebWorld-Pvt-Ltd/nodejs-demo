const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const renderPage = require('../../utils/render');
const { body, validationResult } = require('express-validator');

class AuthController 
{
  static login(req, res) 
  {
    res.render('admin/login', { 
              errors: {},
              error: null,
              oldInput: { email:'' }
          });
  }

  static async postLogin(req, res) 
  {
      const errors = validationResult(req);
      let errorObj = {};

      if (!errors.isEmpty()) {

          errors.array().forEach(err => {
            errorObj[err.path] = err.msg;
          });

          return res.render('admin/login', { 
              errors: errorObj,
              error: null,
              oldInput: { email: req.body.email }
          });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.render('admin/login', { 
              errors: {},
              error: 'The email or password you entered is incorrect', 
              oldInput: { email } 
          });
      }

      req.session.admin = user;
      req.flash('success_msg', 'Login Successfully!');
      res.redirect('/admin/dashboard');
  }

  static logout(req, res) 
  {
    req.session.destroy(() => res.redirect('/admin/login'));
  }
}

module.exports = AuthController;
