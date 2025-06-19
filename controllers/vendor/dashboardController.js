const renderVendor = require('../../utils/renderVendor');

class DashboardController 
{
  static index(req, res) 
  {
    renderVendor(res, req, 'dashboard', { user: req.session.vendor, title: req.t('Vendor Dashboard') });
  }
}

module.exports = DashboardController;
