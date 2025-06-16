const applyDateFormatting = require('../utils/datetimeFormatter');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const moment = require('moment'); // or dayjs

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  status: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  token: { type: DataTypes.TEXT },
}, {
  paranoid: true,
  timestamps: true,
  deletedAt: 'deletedAt',
  tableName: 'users'
});

applyDateFormatting(User);

module.exports = User;
