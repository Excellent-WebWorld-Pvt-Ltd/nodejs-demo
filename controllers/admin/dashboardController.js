const { datatableQuery } = require('../../utils/datatable');
const User = require('../../models/User');
const renderPage = require('../../utils/render');

class DashboardController 
{
  static index(req, res) 
  {
    renderPage(res, 'dashboard', { user: req.session.admin, title:'Dashboard' });
  }
}

module.exports = DashboardController;
