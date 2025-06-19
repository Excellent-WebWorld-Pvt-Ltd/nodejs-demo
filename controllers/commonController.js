const utilsDeleteRecord = require('../utils/deleteRecord');
const utilsChangeStatus = require('../utils/changeStatus');

class CommonController 
{
  static async deleteRecord(req, res) 
  {
    const { id,model } = req.query;
    const result = await utilsDeleteRecord(req, model, id);
    res.json(result);
  }

  static async changeStatus(req, res) 
  {
    const { id,model,status } = req.query;
    const result = await utilsChangeStatus(req, model, id, 'status', status);
    res.json(result);
  }
  static async changeLanguage(req, res) 
  {
    const { lng } = req.query;
    req.session.lng = lng;  
    if (req.headers.referer) {  
      return res.redirect(req.headers.referer);
    }
    return res.redirect('/'); // Fallback redirect if referer is not available
  }
}

module.exports = CommonController;
