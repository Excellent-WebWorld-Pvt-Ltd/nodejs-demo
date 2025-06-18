const renderVendor = require('../../utils/renderVendor');

class DashboardController 
{
  static index(req, res) 
  {
    renderVendor(res, 'dashboard', { user: req.session.vendor, title:'Vendor Dashboard' });
  }
}

module.exports = DashboardController;
