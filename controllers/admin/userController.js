const { datatableLoad } = require('../../utils/datatable');
const User = require('../../models/User');
const renderPage = require('../../utils/render');
const handleFileUpload = require('../../utils/uploadFile');
const { validateRequiredFields } = require('../../utils/validator');
require('dotenv').config();

class UserController 
{
  static users(req, res) 
  {
    renderPage(res, req, 'users/index', { user: req.session.admin, title: req.t('Users') });
  }

  static async getUsers(req, res) 
  {
    const result = await datatableLoad(req, User, ['name', 'email', 'role']);
    res.json(result);
  }

  static async edit(req, res) 
  {
    if(req.params.id > 0)
    {
      try 
      {
        const user_data = await User.findByPk(req.params.id);
        if (!user_data) 
        {
            req.flash('error_msg', req.t('User not found'));
            res.redirect('/admin/users');
        }
        renderPage(res, req, 'users/edit', {user: req.session.admin, title:req.t('Users'),user_data:user_data});
      } 
      catch (error) 
      {
        req.flash('error_msg', req.t('User not found'));
        res.redirect('/admin/users');
      }
    }
    else
    {
      res.redirect('/admin/users');
    }
  }

  static async update(req, res) {

    const backURL = req.header('Referer') || '/admin/dashboard';    
    try 
    {
      await handleFileUpload(req, res, 'image');

      const { id, name, email } = req.body;
      const fieldMap = { id: 'Id', name: 'Name', email: 'Email' };

      const error = await validateRequiredFields(req.body, fieldMap);
      if(error != true)
      {
        req.flash('error_msg', error);
        return res.redirect(backURL);
      }

      const user = await User.findByPk(id);

      if (!user) 
      {
        req.flash('error_msg', req.t('User not found'));
        return res.redirect('/admin/users');
      }

      let image = user.image;

      if (req.file) 
      {
        image = req.file.path.replace("/var/www/public", "admin");
      }

      // Email uniqueness validation
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id != user.id) {
        req.flash('error_msg', req.t('Email already exists!'));
        return res.redirect(backURL);
      }

      user.name = name;
      user.email = email;
      user.image = image;

      await user.save();
      req.flash('success_msg', req.t('User updated Successfully!'));
      res.redirect('/admin/users');
    } 
    catch (error) 
    {
      if (error.status) 
      {
        const { id } = req.body;
        req.flash('error_msg', error.message);
        res.redirect(backURL);
      } 
      else if (error.name === 'SequelizeUniqueConstraintError') 
      {
        req.flash('error_msg', req.t('Email already exists!'));
        res.redirect(backURL);
      } 
      else 
      {
        console.error('Unknown error:', error);
        req.flash('error_msg', req.t('An unexpected error occurred.'));
        res.redirect(backURL);
      }
    }
  }
}

module.exports = UserController;
