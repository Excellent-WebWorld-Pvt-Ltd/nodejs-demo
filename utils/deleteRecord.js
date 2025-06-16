const models = require('../models');
const deleteRecord = async (modelName, id, force = false) => {
  try {
    
    const Model = models[modelName]; // dynamic model
    if (!Model) return { success: false, message: 'Invalid model.' };

    const record = await Model.findByPk(id);
    console.log(record)
    if (!record) {
      return { success: false, message: 'Record not found.' };
    }

    await record.destroy({ force }); // force: true for hard delete
    return { success: true, message: 'Record deleted successfully.' };
  } catch (error) {
    console.error('Delete Record Error:', error);
    return { success: false, message: 'Failed to delete record.' };
  }
};

module.exports = deleteRecord;