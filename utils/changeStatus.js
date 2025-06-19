const models = require('../models');
const changeStatus = async (req, modelName, id, statusField = 'status', newStatus) => {
  try {
    
    const Model = models[modelName]; // dynamic model
    if (!Model) return { success: false, message: 'Invalid model.' };

    const record = await Model.findByPk(id);
    if (!record) {
      return { success: false, message: req.t('Record not found') };
    }

    record[statusField] = newStatus;
    await record.save();

    return { success: true, message: req.t('Status updated successfully') };
  } catch (error) {
    //console.error('Change Status Error:', error);
    return { success: false, message: req.t('Failed to update status') };
  }
};

module.exports = changeStatus;