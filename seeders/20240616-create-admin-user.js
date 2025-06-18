'use strict';
const bcrypt = require('bcryptjs'); // assuming you want to hash the password

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10); // hashing password

    return queryInterface.bulkInsert('users', [{
      name: 'Admin User',
      email: 'admin.user1@yopmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 1,
      image: null,
      token: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin.user1@yopmail.com' }, {});
  }
};
