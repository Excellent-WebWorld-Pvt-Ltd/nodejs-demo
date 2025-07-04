const { datatableQuery } = require('../../utils/datatable');
const User = require('../../models/User');
const renderPage = require('../../utils/render');

class DashboardController 
{
  static index(req, res) 
  {
    renderPage(res, req, 'dashboard', { user: req.session.admin, title: req.t('Dashboard') });
  }
}

module.exports = DashboardController;
