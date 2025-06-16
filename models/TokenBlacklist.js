const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  paranoid: false, // no soft delete needed unless you want it
  timestamps: true, // createdAt and updatedAt
  tableName: 'TokenBlacklists' // matches your migration table name
});

module.exports = TokenBlacklist;