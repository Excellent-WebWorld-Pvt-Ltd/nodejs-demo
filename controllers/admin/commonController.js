const utilsDeleteRecord = require('../../utils/deleteRecord');
const utilsChangeStatus = require('../../utils/changeStatus');

class CommonController 
{
  static async deleteRecord(req, res) 
  {
    const { id,model } = req.query;
    const result = await utilsDeleteRecord(model, id);
    res.json(result);
  }

  static async changeStatus(req, res) 
  {
    const { id,model,status } = req.query;
    const result = await utilsChangeStatus(model, id, 'status', status);
    res.json(result);
  }
}

module.exports = CommonController;
