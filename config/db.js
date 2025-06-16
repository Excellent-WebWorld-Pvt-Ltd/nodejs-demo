require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '+05:30', // Set your timezone here (e.g., '+00:00' for UTC, '+05:30' for IST)
  logging: false,
  define: {
    timestamps: true, // createdAt, updatedAt
    paranoid: true,   // deletedAt
  }
});
module.exports = sequelize;