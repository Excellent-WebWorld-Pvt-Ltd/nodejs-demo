const { Op } = require('sequelize');

exports.datatableLoad = async (req, model, searchableFields = []) => {
  const draw = parseInt(req.query.draw) || 0;
  const start = parseInt(req.query.start) || 0;
  const length = parseInt(req.query.length) || 10;
  const searchValue = req.query['search[value]'] || '';
  const orderColumnIndex = req.query['order[0][column]'] || 0;
  const orderColumn = req.query[`columns[${orderColumnIndex}][data]`] || 'id';
  const orderDir = req.query['order[0][dir]'] || 'asc';

  const where = searchValue && searchableFields.length
    ? {
        [Op.or]: searchableFields.map(field => ({
          [field]: { [Op.like]: `%${searchValue}%` } // use Op.like for MySQL
        }))
      }
    : {};

  try {
    const totalRecords = await model.count();
    const filteredRecords = await model.count({ where });

    const data = await model.findAll({
      where,
      order: [[orderColumn, orderDir]],
      offset: start,
      limit: length
    });

    return {
      draw,
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
      data
    };
  } catch (err) {
    console.error('DataTables Query Error:', err);
    return {
      draw,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],
      error: 'Failed to fetch data.'
    };
  }
};
